import { Component, ViewChild } from '@angular/core';
import { CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable, matrixType, gearTypes, augStatList } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';
import { AlertInput, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage {
  @ViewChild('hiddenCanvas') editCanvas:any;
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
  charIndex: number = 0;
  matrixOrder: matrixType[] = ["Emotion","Mind","Faith","Memory"];
  eqOrder: gearTypes[] = ["Helm","Eyepiece","Spaulders","Handguards","Bracers","Armor","Combat Engine","Belt","Legguards","Sabatons","Exoskeleton","Microreactor"];
  server:serverList[] = ["Asia Pacific","Europe","North America","South America","Southeast Asia"];
  tempWeaponStar = [{hovering:false,star:0},{hovering:false,star:0},{hovering:false,star:0}];
  tempMatrixStar = [{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}},{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}},{Emotion:{hovering:false,star:0},Faith:{hovering:false,star:0},Memory:{hovering:false,star:0},Mind:{hovering:false,star:0}}];
  constructor(
    private alert: AlertController,
    private meta: Meta,
    private title: Title,
    public char: CharacterService
  ) {
    this.setTag();
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

  }

  async share(){
    var canvasElement = this.editCanvas.nativeElement;
    let ctx = canvasElement.getContext('2d');
    ctx.canvas.width  = 768;
    ctx.canvas.height = 432;
    let drawing = new Image();
    drawing.src = "assets/background/tempshare.jpg";
    await drawing.decode();
    ctx.drawImage(drawing,0,0);
    ctx.font = `bold 32px sans-serif`;
    ctx.lineWidth = 2;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.strokeText(`${this.char.characterInfo.name} ${this.char.characterInfo.uid}`, 5, 30);
    ctx.fillText(`${this.char.characterInfo.name} ${this.char.characterInfo.uid}`, 5, 30);
    let img = (await (await fetch(`${canvasElement.toDataURL('image/jpeg')}`)).blob());
    let imgjson = new Blob([img,`tof.nandakho.my.id:${JSON.stringify(this.char.characterInfo)}`],{type:'image/jpeg'});
    const url = window.URL.createObjectURL(imgjson);
    this.download(url,`${this.generateName()}.jpg`);
  }

  generateName(){
    const d = new Date();
    return `${d.getFullYear().toString().padStart(4,"0")}${d.getUTCMonth().toString().padStart(2,"0")}${d.getDate().toString().padStart(2,"0")}${d.getHours().toString().padStart(2,"0")}${d.getMinutes().toString().padStart(2,"0")}${d.getSeconds().toString().padStart(0,"0")}`;
  }

  download(what:string,name:string){
    var a = document.createElement("a");
    a.href = what;
    a.download = name;
    a.click();
  }

  async loadData(){
    console.log(`File upload here`);
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (_) => { 
      var fileread = ((await input.files?.item(0)?.text())??"").split("tof.nandakho.my.id:");
      if(fileread?.length==2){
        try {
          const data = JSON.parse(fileread[1]);
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log(`Unrecognized file!`);
      }
    }
    input.click();
  }

  starWeaponSet(index:number,star:number) {
    const cStar = this.char.characterInfo.weapon[index].advance;
    this.char.characterInfo.weapon[index].advance = cStar==star?0:star;
    this.tempWeaponStar[index].star = star;
    this.tempWeaponStar[index].hovering = false;
  }

  starWeaponHover(index:number,star:number){
    this.tempWeaponStar[index].star = star;
    this.tempWeaponStar[index].hovering = true;
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
      r.push({
        label: curWeap,
        type: "radio",
        value: curWeap,
        checked: true,
        cssClass: `weapon-${curWeap.replace(" ","_")}`
      });
    }
    for(const w of this.wp.sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      if(!alrdyEq.includes(w)){
        r.push({
          label: w,
          type: "radio",
          value: w,
          checked: w==this.char.characterInfo.weapon[index].name,
          cssClass: `weapon-${w.replace(" ","_")}`
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
    if(this.char.characterInfo.gear[etype].rarity=="5"){
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
    await this.char.saveStat(this.charIndex);
  }

  get hp() {
    return Math.round(this.char.characterStat.getVal("HP"));
  }

  get crit() {
    return Math.floor(this.char.characterStat.getVal("Crit"));
  }

  get critPercent() {
    return this.char.characterStat.getVal("CritPercent");
  }

  get physicalAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("PhysicalAttackPercent")/100)));
  }

  get flameAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FlameAttackPercent")/100)));
  }

  get frostAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FrostAttackPercent")/100)));
  }

  get voltAtk() {
    return Math.round(Math.round((this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("VoltAttackPercent")/100)));
  }

  get alterAtk() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]+this.char.characterStat.getVal("AlterAttack"));
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