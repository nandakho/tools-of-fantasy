import { Component, ViewChild } from '@angular/core';
import { ConstService, CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable, matrixType, gearTypes, augStatList, MiscService, evoMax, evoAvailable } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';
import { AlertInput, AlertController } from '@ionic/angular';
import { addMetadataFromBase64DataURI, getMetadata } from 'meta-png';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage {
  @ViewChild('hiddenCanvas') editCanvas:any;
  @ViewChild('shareModal') modal:any;
  wp = Object.keys(weaponAvailable);
  mt = matrixAvailable.List;
  sp = Object.keys(supreAvailable).map(x=>{
    return {k:x,v:x.replace("_",".")}
  });
  gr = Object.keys(gearAvailable);
  rs = randomStatList;
  as = augStatList;
  ts = titanStatList;
  al = augAvailable;
  evo = evoAvailable;
  evoMax = evoMax;
  saving:boolean = false;
  matrixOrder: matrixType[] = ["Emotion","Mind","Faith","Memory"];
  eqOrder: gearTypes[] = ["Helm","Eyepiece","Spaulders","Handguards","Bracers","Armor","Combat Engine","Belt","Legguards","Sabatons","Exoskeleton","Microreactor"];
  server:serverList[] = ["Asia Pacific","Europe","North America","South America","Southeast Asia"];
  tempWeaponStar = [{hovering:false,star:0},{hovering:false,star:0},{hovering:false,star:0}];
  tempMatrixStar = [{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}},{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}},{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}}];
  tempAddStat: number|undefined = undefined;
  baseImage: any = undefined;
  customBackground: any = null;
  fillMethod: imageFillMethod = "Fill";
  fillMethodList: imageFillMethod[] = ["Fill","Contain","Contain & Centered","Cover","Cover & Centered","Original","Centered"];
  shareImage: string = "";
  shareImageBgOpacity: number = 100;
  constructor(
    private alert: AlertController,
    private meta: Meta,
    private title: Title,
    public char: CharacterService,
    private misc: MiscService,
    private con: ConstService
  ) {
    this.setTag();
  }

  async ionViewWillLeave(){
    this.modal.dismiss();
  }

  setTag(){
    const title = `Tools of Fantasy - My Character`;
    const desc = `Ever wanted to know how your stats will look like with different equipment? Try it out yourself!`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: `/my-char` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `Tools of Fantasy - My Character` });
    this.meta.updateTag({ property: 'og:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: `Tools of Fantasy - My Character` });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
  }

  async reloadChar(){
    await this.char.loadStat(this.char.charId);
  }

  async share(){
    const dim = {
      w: 1920,
      h: 1080
    }
    this.baseImage = await this.generateBaseImage();
    this.shareImageBgOpacity = 100;
    this.customBackground = null;
    var c = this.editCanvas.nativeElement;
    let ctx = c.getContext('2d');
    ctx.canvas.width  = dim.w;
    ctx.canvas.height = dim.h;
    ctx.clearRect(0, 0, dim.w, dim.h);
    ctx.fillStyle = `rgba(30, 32, 35, 1)`
    ctx.fillRect(0, 0, dim.w, dim.h);
    ctx.drawImage(this.baseImage,0,0);
    this.shareImage = this.embedMetadata(c.toDataURL('image/png'));
    this.modal.present();
  }

  async loadCustomImage(){
    try {
      this.customBackground = await this.getCustomImage();
      await this.refreshShareImage();
    } catch (err:any) {
      this.customBackground = null;
      this.misc.showToast(err);
    }
  }

  async getCustomImage(){
    return new Promise((resolve,reject)=>{
      const isImage = (str:string) => {
        if(str.startsWith("data:image/")) return true;
        return false;
      }
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = async (_) => { 
        const fr = new FileReader();
        const item = await input.files?.item(0);
        if(item!=null){
          fr.readAsDataURL(item);
          fr.onload = async (e) =>{
            const loaded = e?.target?.result;
            if(loaded!=null && isImage(loaded as string)){
              try {
                let img = new Image();
                img.src = loaded as string;
                return resolve(img);
              } catch(err) {
                return reject(err);
              }
            } else {
              return reject ("File is not an image!");
            }
          }
        }
      }
      input.click();
    });
  }

  async refreshShareImage(){
    const dim = {
      w: 1920,
      h: 1080
    }
    const calcImgDim = (xw:number,yw:number) => {
      const ratio = {
        x: dim.w/xw,
        y: dim.h/yw
      }
      return {
        ratio,
        cover: {
          width: ratio.x>ratio.y?1920:Math.round(xw*ratio.y),
          height: ratio.y>ratio.x?1080:Math.round(yw*ratio.x)
        },
        contain: {
          width: ratio.x>ratio.y?Math.round(xw*ratio.y):1920,
          height: ratio.y>ratio.x?Math.round(yw*ratio.x):1080
        }
      };
    }
    var c = this.editCanvas.nativeElement;
    let ctx = c.getContext('2d');
    ctx.canvas.width  = dim.w;
    ctx.canvas.height = dim.h;
    ctx.clearRect(0, 0, dim.w, dim.h);
    if(this.customBackground!=null){
      const imgDim = calcImgDim(this.customBackground.width,this.customBackground.height);
      switch(this.fillMethod){
        case "Fill":
          ctx.drawImage(this.customBackground,0,0,dim.w,dim.h);
          break;
        case "Contain":
          ctx.drawImage(this.customBackground,0,0,imgDim.contain.width,imgDim.contain.height);
          break;
        case "Contain & Centered":
          ctx.drawImage(this.customBackground,((dim.w/2)-(imgDim.contain.width/2)),((dim.h/2)-(imgDim.contain.height/2)),imgDim.contain.width,imgDim.contain.height);
          break;
        case "Cover":
          ctx.drawImage(this.customBackground,0,0,imgDim.cover.width,imgDim.cover.height);
          break;
        case "Cover & Centered":
          ctx.drawImage(this.customBackground,((dim.w/2)-(imgDim.cover.width/2)),((dim.h/2)-(imgDim.cover.height/2)),imgDim.cover.width,imgDim.cover.height);
          break;
        case "Original":
          ctx.drawImage(this.customBackground,0,0);
          break;
        case "Centered":
          ctx.drawImage(this.customBackground,((dim.w/2)-(this.customBackground.width/2)),((dim.h/2)-(this.customBackground.height/2)),this.customBackground.width,this.customBackground.height);
          break;
      }
      ctx.fillStyle = `rgba(30, 32, 35, ${(100-this.shareImageBgOpacity)/100})`;
      ctx.fillRect(0, 0, dim.w, dim.h);
    } else {
      ctx.fillStyle = `rgba(30, 32, 35, ${this.shareImageBgOpacity/100})`;
      ctx.fillRect(0, 0, dim.w, dim.h);
    }
    ctx.drawImage(this.baseImage,0,0);
    this.shareImage = this.embedMetadata(c.toDataURL('image/png'));
  }

  embedMetadata(imgString:string){
    let strData = this.misc.encodeString(JSON.stringify(this.char.characterInfo));
    return addMetadataFromBase64DataURI(imgString,'tof.nandakho.my.id',strData);
  }

  async generateBaseImage(){
    this.saving = true;
    const imgSize = {
      width: 1920,
      height: 1080
    }
    const colors = {
      white:"#ffffff",
      black:"#000000",
      warning:"#ffc409",
      medium:"#92949c",
      dark:"#1e2023",
    }
    const fontSize = (size:number) => {
      ctx.font = `bold ${size}px Sans-serif`;
    }
    const color = {
      fill: (color:string) => {
        ctx.fillStyle = color;
      },
      stroke: (color:string) => {
        ctx.strokeStyle = color;
      }
    }
    const strokedText = (text:string,lineWidth:number,x:number,y:number,clr:"white"|"black"|"warning"|"medium"|"dark"="white") => {
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "miter";
	    ctx.miterLimit = 2;
      color.stroke(colors.medium);
      color.fill(colors[clr]);
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }
    const insertIcon = async (src:string,size:{zoom?:number,w?:number,h?:number},x:number,y:number) => {
      let drawing = new Image();
      drawing.src = src;
      await drawing.decode();
      let newW;
      let newH;
      if(size.w) newW=size.w;
      if(size.h) newH=size.h;
      if(size.zoom){
        newW = drawing.width*size.zoom;
        newH = drawing.height*size.zoom;
      }
      ctx.drawImage(drawing,x,y,newW,newH);
    }
    const insertBorder = (w:number,h:number,x:number,y:number) => {
      ctx.roundRect(x, y, w, h, 5);
      ctx.stroke();
    }
    let offCanvas = new OffscreenCanvas(1920,1080);
    let ctx:any = offCanvas.getContext('2d');
    ctx.canvas.width  = imgSize.width;
    ctx.canvas.height = imgSize.height;
    //nickname
    fontSize(72);
    strokedText(`${this.char.characterInfo.name}`,8, 10, 65);
    //level & supre
    fontSize(48);
    strokedText(`Level: ${this.char.characterInfo.level}`, 8, 10, 140);
    if(this.char.characterInfo.supre!=null){
      await insertIcon(`assets/icon/suppressors/${this.char.characterInfo.supre}.png`, {zoom:1.5}, 310, 100);
    }
    //server & uid
    fontSize(32);
    const suid = `Server: ${this.char.characterInfo.server??'-'}   UID: ${this.char.characterInfo.uid??'-'}`
    const suidMetrics = ctx.measureText(suid);
    strokedText(suid, 6, (imgSize.width-suidMetrics.width-12), 1067);
    //unlocked - shots&simul
    fontSize(32);
    strokedText(`Shots:`, 6, 10, 210);
    await insertIcon(`assets/icon/items/PowerShot.png`, {zoom:0.4}, 110, 145);
    strokedText(`x ${this.char.characterInfo.shots.powerShot}`, 6, 200, 225);
    await insertIcon(`assets/icon/items/SourceShot.png`, {zoom:0.4}, 260, 145);
    strokedText(`x ${this.char.characterInfo.shots.sourceShot}`, 6, 350, 225);
    fontSize(32);
    strokedText(`Simulacra:`, 6, 10, 280);
    strokedText(`4500: ${this.char.characterInfo.simul[4500]}x   5500: ${this.char.characterInfo.simul[5500]}x   7000: ${this.char.characterInfo.simul[7000]}x`, 6, 20, 320);
    //weapons & matrixs
    let widx = 0;
    for(let w of this.char.characterInfo.weapon){
      ctx.lineWidth = 4;
      insertBorder(200,380,20+(widx*200)+(widx*10),380);
      if(w.name!=null){
        await insertIcon(`assets/icon/weapons/${this.getName(widx)}.png`, {zoom:0.6}, 20+(widx*200)+(widx*10), 380);
        await insertIcon(`assets/icon/elements/Element_${this.getEle(widx)}.png`, {zoom:0.8}, 22+(widx*200)+(widx*10), 382);
        await insertIcon(`assets/icon/weapons/Reso_${this.getReso(widx)}.png`, {zoom:0.8}, 68+(widx*200)+(widx*10), 382);
        fontSize(24);
        strokedText(`${w.level} (${w.advance}★)`, 4, 120+(widx*200)+(widx*10), 405);
        const matEmo = w.matrix.Emotion;
        const matMind = w.matrix.Mind;
        const matFaith = w.matrix.Faith;
        const matMemory = w.matrix.Memory;
        if(matEmo.name!=null){
          await insertIcon(`assets/icon/matrixs/${matEmo.name}.png`, {zoom:0.25}, 15+(widx*200)+(widx*10), 520);
          fontSize(16);
          strokedText(`${matEmo.level} (${matEmo.advance}★)`, 2, 48+(widx*200)+(widx*10), 638);
        } else {
          await insertIcon(`assets/icon/equipments/null.svg`, {zoom:0.5}, 50+(widx*200)+(widx*10), 553);
        }
        if(matMind.name!=null){
          await insertIcon(`assets/icon/matrixs/${matMind.name}.png`, {zoom:0.25}, 95+(widx*200)+(widx*10), 520);
          fontSize(16);
          strokedText(`${matMind.level} (${matMind.advance}★)`, 2, 132+(widx*200)+(widx*10), 638);
        } else {
          await insertIcon(`assets/icon/equipments/null.svg`, {zoom:0.5}, 115+(widx*200)+(widx*10), 553);
        }
        if(matFaith.name!=null){
          await insertIcon(`assets/icon/matrixs/${matFaith.name}.png`, {zoom:0.25}, 15+(widx*200)+(widx*10), 630);
          fontSize(16);
          strokedText(`${matFaith.level} (${matFaith.advance}★)`, 2, 48+(widx*200)+(widx*10), 748);
        } else {
          await insertIcon(`assets/icon/equipments/null.svg`, {zoom:0.5}, 35+(widx*200)+(widx*10), 663);
        }
        if(matMemory.name!=null){
          await insertIcon(`assets/icon/matrixs/${matMemory.name}.png`, {zoom:0.25}, 95+(widx*200)+(widx*10), 630);
          fontSize(16);
          strokedText(`${matMemory.level} (${matMemory.advance}★)`, 2, 132+(widx*200)+(widx*10), 748);
        } else {
          await insertIcon(`assets/icon/equipments/null.svg`, {zoom:0.5}, 115+(widx*200)+(widx*10), 663);
        }
      } else {
        await insertIcon(`assets/icon/equipments/null.svg`, {zoom:1.2}, 30+(widx*200)+(widx*10), 480);
      }
      widx++;
    }
    //equipments
    let gidx = 0;
    for(let gtype of this.eqOrder){
      ctx.lineWidth = 2;
      insertBorder(220,84,670,14+(gidx*84)+(gidx*4));
      const g = this.char.characterInfo.gear[gtype as gearTypes];
      if(g.rarity!=null){
        fontSize(24);
        strokedText(`${g.enhance}`, 2, 673, 36+(gidx*84)+(gidx*4));
        if(evoAvailable.includes(gtype)){
          fontSize(18);
          strokedText(`E${g.evolution??0}`, 2, 705, 34+(gidx*84)+(gidx*4),"warning");
        }
        await insertIcon(`assets/icon/equipments/${gtype} ${g.rarity}.png`,{zoom:0.3}, 670, 24+(gidx*84)+(gidx*4));
        let ridx = 0;
        let hrd = 26;
        if(g.rarity=="5") hrd = 42;
        for(let r of g.random){
          if(r.type!=null){
            await insertIcon(`assets/icon/stats/${r.type}.png`,{zoom:0.7}, 740+(ridx*34)+(ridx*2), hrd+(gidx*84)+(gidx*4));
            fontSize(10);
            strokedText(`${r.val}`, 1, 740+(ridx*34)+(ridx*2), hrd+(gidx*84)+(gidx*4));
          } else {
            await insertIcon(`assets/icon/equipments/null.svg`,{zoom:0.2}, 740+(ridx*42)+(ridx*2), (hrd+4)+(gidx*84)+(gidx*4));
          }
          ridx++;
        }
        let aidx = 0;
        if(g.rarity!="5"){
          for(let a of g.augment){
            if(a.type!=null){
              await insertIcon(`assets/icon/stats/${a.type}.png`,{zoom:0.7}, 740+(aidx*34)+(aidx*2), (hrd+40)+(gidx*84)+(gidx*4));
              fontSize(10);
              strokedText(`${a.val}`, 1, 740+(aidx*34)+(aidx*2), (hrd+40)+(gidx*84)+(gidx*4));
            } else {
              await insertIcon(`assets/icon/equipments/null.svg`,{zoom:0.2}, 740+(aidx*42)+(aidx*2), (hrd+44)+(gidx*84)+(gidx*4));
            }
            aidx++;
          }
          if(g.rarity=="Titan"){
            await insertIcon(`assets/icon/stats/${g.rare.type}.png`,{zoom:0.7}, 740+(aidx*34)+(aidx*2), (hrd+40)+(gidx*84)+(gidx*4));
            fontSize(10);
            strokedText(`${g.rare.val}`, 1, 740+(aidx*34)+(aidx*2), (hrd+40)+(gidx*84)+(gidx*4));
          }
        }
      } else {
        await insertIcon(`assets/icon/equipments/null.svg`, {zoom:0.45}, 747, 24+(gidx*84)+(gidx*4));
        await insertIcon(`assets/icon/equipments/${gtype}.png`, {zoom:0.7}, 747, 24+(gidx*84)+(gidx*4));
      }
      gidx++;
    }
    //stats
    let statOffset = {
      x: 60,
      y: 95,
      idx: 0
    }
    ctx.lineWidth = 4;
    insertBorder(940,990,statOffset.x+890,statOffset.y+(-65));
    fontSize(36);
    strokedText(`Stats`, 4, statOffset.x+910, statOffset.y+(-14));
    strokedText(`Specials`, 4, statOffset.x+1410, statOffset.y+(-14));
    await insertIcon(`assets/icon/stats/HP.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`HP`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.hp}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Crit.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Crit`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const scrit = ctx.measureText(this.crit);
    strokedText(`${this.crit}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(Equals ${this.critPCalc}%)`, 2, 970+(scrit.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/CritPercent.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Crit Rate`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const scritp = ctx.measureText(`${this.critPercent}%`);
    strokedText(`${this.critPercent}%`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(Equals ${this.critBCalc})`, 2, 970+(scritp.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/PhysicalAttack.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Physical Attack`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const spa = ctx.measureText(`${this.physicalAtk}`);
    strokedText(`${this.physicalAtk}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(${this.physicalAtkB} + ${this.physicalAtkP}) (Damage: ${this.physicalDam}%)`, 2, 970+(spa.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/FlameAttack.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Flame Attack`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const spfl = ctx.measureText(`${this.flameAtk}`);
    strokedText(`${this.flameAtk}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(${this.flameAtkB} + ${this.flameAtkB}) (Damage: ${this.flameDam}%)`, 2, 970+(spfl.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/FrostAttack.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Frost Attack`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const spfr = ctx.measureText(`${this.frostAtk}`);
    strokedText(`${this.frostAtk}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(${this.frostAtkB} + ${this.frostAtkP}) (Damage: ${this.frostDam}%)`, 2, 970+(spfr.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/VoltAttack.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Volt Attack`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const spv = ctx.measureText(`${this.voltAtk}`);
    strokedText(`${this.voltAtk}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(${this.voltAtkB} + ${this.voltAtkP}) (Damage: ${this.voltDam}%)`, 2, 970+(spv.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/AlterAttack.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Altered Attack`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    const spal = ctx.measureText(`${this.alterAtk}`);
    strokedText(`${this.alterAtk}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    fontSize(16);
    strokedText(`(${this.alterAtkB} + ${this.alterAtkP})`, 2, 970+(spal.width+10)+statOffset.x, 58+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/PhysicalResist.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Physical Resist`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.physicalRes}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/FlameResist.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Flame Resist`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.flameRes}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/FrostResist.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Frost Resist`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.frostRes}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/VoltResist.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Volt Resist`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.voltRes}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/AlterResist.png`, {zoom:1.5}, 900+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Altered Resist`, 2, 970+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.alterRes}`, 2, 970+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx = 0;
    //titan special
    await insertIcon(`assets/icon/stats/Block.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Block`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanBlock}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Weak.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Weak Point Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanWeak}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Lifesteal.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Lifesteal`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanLifesteal}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Recovery.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`HP Recovery`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanRecovery}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Delay.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Delay`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanDelay}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Normal.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Normal Attack Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanNormal}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Dodge.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Dodge Attack Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanDodge}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Skill.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Skill Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanSkill}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Discharge.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Discharge Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanDischarge}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Damage.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Damage Boost`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanDamage}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Reduction.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Damage Reduction`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanReduction}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    statOffset.idx++;
    await insertIcon(`assets/icon/stats/Heal.png`, {zoom:1.5}, 1400+statOffset.x, 10+(statOffset.idx*70)+statOffset.y);
    fontSize(24);
    strokedText(`Increased Healing`, 2, 1470+statOffset.x, 36+(statOffset.idx*70)+statOffset.y);
    strokedText(`${this.titanHeal}`, 2, 1470+statOffset.x, 61+(statOffset.idx*70)+statOffset.y);
    //qr
    await insertIcon(`assets/icon/siteqr.png`, {zoom:0.6}, 10, 895);
    //icon
    await insertIcon(`assets/icon/icon.png`, {zoom:0.2}, 200, 905);
    fontSize(16);
    strokedText(`This image contains Metadata, load it in the site to view more detailed info!`, 2, 10, 800);
    strokedText(`Notes:`, 2, 10, 830);
    strokedText(`Some media sharing apps 'might' strip image Metadata`, 2, 10, 850);
    strokedText(`It is advised to send as 'files' if the option is available`, 2, 10, 870);
    fontSize(24);
    strokedText(`Generate your own at:`, 2, 200, 1039);
    strokedText(`https://tof.nandakho.my.id`, 2, 200, 1067);
    this.saving = false;
    return Promise.resolve(offCanvas);
  }

  async finalizeImage(){ 
    this.download(this.shareImage,`${this.char.generateTimestamp()}.png`);
    this.modal.dismiss();
  }

  async download(what:string,name:string){
    if(this.con.mode=="web"){
      var a = document.createElement("a");
      a.href = what;
      a.download = name;
      a.click();
    } else {
      try {
        let p = 'tof.nandakho.my.id/';
        await this.misc.writeFile(what,name,{path:p});
        this.misc.showToast(`File saved in Documents!`);
      } catch (err) {
        let e = err as string;
        this.misc.showToast(e);
      }
    }
  }

  async delChar(){
    const alert = await this.alert.create({
      header: `Delete This Character?`,
      backdropDismiss: true,
      mode: "ios",
      buttons: [{
        text:'Keep'
      },{
        text:'Delete',
        cssClass: `del-btn`,
        handler: async ()=>{
          await this.char.delChar(this.char.charId);
        }
      }]
    });
    alert.present();
  }

  async loadData(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (_) => { 
      const fr = new FileReader();
      const item = await input.files?.item(0);
      if(item!=null){
        fr.readAsArrayBuffer(item);
        fr.onload = async (e) =>{
          const loaded = e?.target?.result;
          if(loaded!=null){
            try {
              const dataArray = new Uint8Array(loaded as ArrayBuffer);
              const metadata = getMetadata(dataArray,"tof.nandakho.my.id");
              if(metadata){
                const decoded = this.misc.decodeString(metadata);
                await this.char.loadStat("",decoded);
              } else {
                this.misc.showToast("Metadata not found!");
              }
            } catch (err) {
              this.misc.showToast('Unrecognized file!');
            }
          }
        }
      }
    }
    input.click();
  }

  addStat(eqType:gearTypes,statType:"random"|"augment",index:number,tempVal:number|undefined){
    let addVal = tempVal??0;
    this.char.characterInfo.gear[eqType][statType][index].val+=addVal;
    this.saveChanges();
  }

  starWeaponSet(index:number,star:number) {
    const cStar = this.char.characterInfo.weapon[index].advance;
    this.char.characterInfo.weapon[index].advance = cStar==star?0:star;
    this.tempWeaponStar[index].star = star;
    this.tempWeaponStar[index].hovering = false;
    this.saveChanges();
  }

  starWeaponHover(index:number,star:number){
    this.tempWeaponStar[index].star = star;
    this.tempWeaponStar[index].hovering = true;
  }

  getName(index:number):string{
    const cw = this.char.characterInfo.weapon[index].name;
    if(cw!=null){
      return `${cw.split(" ")[0]=='Nola'?'Nola':cw}`;
    }
    return `KING`;
  }

  getEle(index:number):string{
    const cw = this.char.characterInfo.weapon[index].name;
    if(cw!=null){
      return weaponAvailable[cw].Element.join("");
    }
    return `Flame`;
  }

  getReso(index:number):string{
    const cw = this.char.characterInfo.weapon[index].name;
    if(cw!=null){
      return weaponAvailable[cw].Type;
    }
    return `Attack`;
  }

  weaponsRadioGenerate(index:number){
    const alrdyEq = this.char.characterInfo.weapon.filter(x=>x.name).map(y=>y.name);
    const curWeap = this.char.characterInfo.weapon[index].name;
    var r:AlertInput[] = [{
      label: "Unequip",
      type: "radio",
      value: null,
      checked: curWeap==null,
      cssClass: `eq-unequip`
    }];
    if(curWeap!=null){
      const cssClass = curWeap.split(" ")[0]=="Nola"?"weapon-Nola":`weapon-${curWeap.replace(/\s/g,"_")}`;
      r.push({
        label: curWeap,
        type: "radio",
        value: curWeap,
        checked: true,
        cssClass
      });
    }
    for(const w of this.wp.sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      if(!alrdyEq.includes(w)){
        const cssClass = w.split(" ")[0]=="Nola"?"weapon-Nola":`weapon-${w.replace(/\s/g,"_")}`;
        r.push({
          label: w,
          type: "radio",
          value: w,
          checked: w==this.char.characterInfo.weapon[index].name,
          cssClass
        });
      }
    }
    return r;
  }

  async weaponChange(index:number):Promise<void>{
    const alert = await this.alert.create({
      header: `Select Weapon ${index+1}`,
      backdropDismiss: true,
      inputs: this.weaponsRadioGenerate(index),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.weapon[index].name = newSelected;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
  }

  starMatrixSet(mtype:string,index:number,star:number) {
    const part = mtype as matrixType;
    const cStar = this.char.characterInfo.weapon[index].matrix[part].advance;
    this.char.characterInfo.weapon[index].matrix[part].advance = cStar==star?0:star;
    this.tempMatrixStar[index][part].star = star;
    this.tempMatrixStar[index][part].hovering = false;
    this.saveChanges();
  }

  starMatrixHover(mtype:string,index:number,star:number){
    const part = mtype as matrixType;
    this.tempMatrixStar[index][part].star = star;
    this.tempMatrixStar[index][part].hovering = true;
  }
  
  starMatrixStopHover(mtype:string,index:number){
    const part = mtype as matrixType;
    this.tempMatrixStar[index][part].hovering = false;
  }

  starMatrixIsHovering(mtype:string,index:number,star:number){
    const part = mtype as matrixType;
    return this.tempMatrixStar[index][part].hovering && this.tempMatrixStar[index][part].star>=star;
  }

  matrixsRadioGenerate(part:matrixType,index:number){
    const curMat = this.char.characterInfo.weapon[index].matrix[part].name;
    var r:AlertInput[] = [{
      label: "Unequip",
      type: "radio",
      value: null,
      checked: curMat==null,
      cssClass: `eq-unequip`
    }];
    for(const m of this.mt.sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      r.push({
        label: m,
        type: "radio",
        value: m,
        checked: m==curMat,
        cssClass: `matrix-${m.replace(" ","_")}`
      });
    }
    return r;
  }

  async matrixChange(mtype:string,index:number):Promise<void>{
    const part = mtype as matrixType;
    const alert = await this.alert.create({
      header: `Select ${part} Matrix`,
      backdropDismiss: true,
      inputs: this.matrixsRadioGenerate(part,index),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.weapon[index].matrix[part].name = newSelected;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
  }

  eqRadioGenerate(etype:gearTypes){
    const rarityList = augAvailable.includes(etype)?['5','Augment','Titan']:['5'];
    const curRar = this.char.characterInfo.gear[etype].rarity;
    var r:AlertInput[] = [{
      label: "Unequip",
      type: "radio",
      value: null,
      checked: curRar==null,
      cssClass: `eq-unequip`
    }];
    for(const m of rarityList){
      r.push({
        label: m==`5`?`${m}*`:m,
        type: "radio",
        value: m,
        checked: m==curRar,
        cssClass: `gear-${etype.replace(" ","-")}-${m}`
      });
    }
    return r;
  }

  async eqChange(etype:string):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Select ${part} Rarity`,
      backdropDismiss: true,
      inputs: this.eqRadioGenerate(part),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.gear[part].rarity = newSelected;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
  }

  eqstatRadioGenerate(etype:gearTypes,index:number,parts:"random"|"augment"){
    const curRand = (this.char.characterInfo.gear[etype][parts][index].type);
    let alrdSelected: any[] = [];
    let lists: string[] = [];
    alrdSelected = this.char.characterInfo.gear[etype].random.map(x=>x.type);
    if(parts=="random"){
      lists = this.rs[etype];
    } else {
      lists = this.as[etype];
      this.char.characterInfo.gear[etype].augment.map(x=>{
        alrdSelected.push(x.type);
      });
    }
    var r:AlertInput[] = [{
      label: "Empty",
      type: "radio",
      value: null,
      checked: curRand==null,
      cssClass: `eq-unequip`
    }];
    if(curRand!=null){
      r.push({
        label: this.beautifyStatString(curRand),
        type: "radio",
        value: curRand,
        checked: true,
        cssClass: `stat-${curRand}`
      })
    }
    for(const m of lists.sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      if(!alrdSelected.includes(m as any)){
        r.push({
          label: this.beautifyStatString(m),
          type: "radio",
          value: m,
          checked: m==curRand,
          cssClass: `stat-${m}`
        });
      }
    }
    return r;
  }

  async eqstatChange(etype:string,index:number,parts:"random"|"augment"):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Random ${index+1}`,
      backdropDismiss: true,
      inputs: this.eqstatRadioGenerate(part,index,parts),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.gear[part][parts][index].type = newSelected;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
  }

  eqtitanRadioGenerate(etype:gearTypes){
    const curRare = (this.char.characterInfo.gear[etype].rare.type);
    var r:AlertInput[] = [{
      label: "Empty",
      type: "radio",
      value: null,
      checked: curRare==null,
      cssClass: `eq-unequip`
    }];
    for(const m of this.ts[etype].sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      r.push({
        label: this.beautifyStatString(m),
        type: "radio",
        value: m,
        checked: m==curRare,
        cssClass: `stat-${m}`
      });
    }
    return r;
  }

  async eqtitanChange(etype:string):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Rare ${etype}`,
      backdropDismiss: true,
      inputs: this.eqtitanRadioGenerate(part),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.gear[part].rare.type = newSelected;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
  }

  beautifyStatString(str:string|null):string {
    if(!str) return `-`;
    return (!["HP","HPPercent"].includes(str)?str.replace(/([A-Z])/g,' $1').trim():str).replace("Percent"," %");
  }

  async saveChanges(){
    await this.char.saveStat(this.char.charId);
  }

  get hp() {
    return Math.round(this.char.characterStat.getVal("HP")*(1+(this.char.characterStat.getVal("HPPercent")/100)));
  }

  get crit() {
    return Math.floor(this.char.characterStat.getVal("Crit"));
  }
  get critDamage() {
    return this.char.characterStat.getVal("CritDamage");
  }
  get critPCalc() {
    return Math.floor((this.char.calcCrit(this.char.characterStat.getVal("Crit"),"percent",this.char.characterInfo.level))*100)/100;
  }
  get critBCalc() {
    return Math.floor((this.char.calcCrit(this.char.characterStat.getVal("CritPercent"),"base",this.char.characterInfo.level))*100)/100;
  }
  get critPercent() {
    return this.char.characterStat.getVal("CritPercent");
  }

  get physicalAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalAtkB() {
    return Math.round(this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack"));
  }
  get physicalAtkP() {
    return Math.round((this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalDam() {
    return Math.round(this.char.characterStat.getVal("PhysicalDamagePercent")*100)/100;
  }

  get flameAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FlameAttackPercent")/100)));
  }
  get flameAtkB() {
    return Math.round(this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack"));
  }
  get flameAtkP() {
    return Math.round((this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("FlameAttackPercent")/100)));
  }
  get flameDam() {
    return Math.round(this.char.characterStat.getVal("FlameDamagePercent")*100)/100;
  }

  get frostAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FrostAttackPercent")/100)));
  }
  get frostAtkB() {
    return Math.round(this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack"));
  }
  get frostAtkP() {
    return Math.round((this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("FrostAttackPercent")/100)));
  }
  get frostDam() {
    return Math.round(this.char.characterStat.getVal("FrostDamagePercent")*100)/100;
  }

  get voltAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("VoltAttackPercent")/100)));
  }
  get voltAtkB() {
    return Math.round(this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack"));
  }
  get voltAtkP() {
    return Math.round((this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("VoltAttackPercent")/100)));
  }
  get voltDam() {
    return Math.round(this.char.characterStat.getVal("VoltDamagePercent")*100)/100;
  }

  get alterAtk() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]+this.char.characterStat.getVal("AlterAttack"));
  }
  get alterAtkB() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]);
  }
  get alterAtkP() {
    return Math.floor(this.char.characterStat.getVal("AlterAttack"));
  }
  get alterDam() {
    return Math.round(this.char.characterStat.getVal("AlterDamagePercent")*100)/100;
  }
  get eleHighest() {
    return [{name:"Physical",val:this.physicalAtk},{name:"Flame",val:this.flameAtk},{name:"Frost",val:this.frostAtk},{name:"Volt",val:this.voltAtk}].sort((a,b)=>b.val-a.val)[0].name;
  }

  get physicalRes(){
    return Math.floor((this.char.characterStat.getVal("PhysicalResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("PhysicalResistPercent")/100)));
  }

  get flameRes(){
    return Math.floor((this.char.characterStat.getVal("FlameResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("FlameResistPercent")/100)));
  }

  get frostRes(){
    return Math.floor((this.char.characterStat.getVal("FrostResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("FrostResistPercent")/100)));
  }

  get voltRes(){
    return Math.floor((this.char.characterStat.getVal("VoltResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("VoltResistPercent")/100)));
  }

  get alterRes(){
    return Math.floor((this.char.characterStat.getVal("AlterResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("AlterResistPercent")/100)));
  }

  get titanBlock(){
    return this.char.characterStat.getVal("Block");
  }

  get titanWeak(){
    return this.char.characterStat.getVal("Weak");
  }
  
  get titanLifesteal(){
    return this.char.characterStat.getVal("Lifesteal");
  }
  
  get titanRecovery(){
    return this.char.characterStat.getVal("Recovery");
  }
  
  get titanDelay(){
    return this.char.characterStat.getVal("Delay");
  }
  
  get titanNormal(){
    return this.char.characterStat.getVal("Normal");
  }
  
  get titanDodge(){
    return this.char.characterStat.getVal("Dodge");
  }
  
  get titanSkill(){
    return this.char.characterStat.getVal("Skill");
  }
  
  get titanDischarge(){
    return this.char.characterStat.getVal("Discharge");
  }
  
  get titanDamage(){
    return this.char.characterStat.getVal("Damage");
  }
  
  get titanReduction(){
    return this.char.characterStat.getVal("Reduction");
  }
  
  get titanHeal(){
    return this.char.characterStat.getVal("Heal");
  }
}

type imageFillMethod = "Fill"|"Contain"|"Contain & Centered"|"Cover"|"Cover & Centered"|"Original"|"Centered";