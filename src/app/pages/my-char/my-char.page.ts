import { Component } from '@angular/core';
import { CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable, matrixType, gearTypes } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';
import { AlertInput, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage {
  wp = Object.keys(weaponAvailable);
  mt = matrixAvailable.List;
  sp = Object.keys(supreAvailable).map(x=>{
    return {k:x,v:x.replace("_",".")}
  });
  gr = Object.keys(gearAvailable);
  rs = randomStatList;
  ts = titanStatList;
  al = augAvailable;
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
    for(const w of this.wp){
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
    for(const m of this.mt){
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
    const rarityList = augAvailable.includes(etype)?['5','Augmented','Titan']:['5'];
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

  async saveChanges(){
    await this.char.saveStat();
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
}