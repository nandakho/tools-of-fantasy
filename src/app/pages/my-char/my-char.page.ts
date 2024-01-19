import { Component } from '@angular/core';
import { CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable, matrixType } from 'src/app/services';
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
  server:serverList[] = ["Asia Pacific","Europe","North America","South America","Southeast Asia"];
  tempWeaponStar = [{hovering:false,star:0},{hovering:false,star:0},{hovering:false,star:0}];
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

  async levelWeapon(index:number){
    const alert = await this.alert.create({
      header: `Adjust Level Weapon ${index+1}`,
      backdropDismiss: true,
      inputs: [{
        label: "Level",
        type: "number"
      }],
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (level)=>{
          console.log(level);
          this.char.characterInfo.weapon[index].level = level;
          await this.saveChanges();
        }
      }]
    });
    alert.present();
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

  async matrixChange(part:string,index:number):Promise<void>{
    const alert = await this.alert.create({
      header: `Select ${part} Matrix`,
      backdropDismiss: true,
      inputs: this.matrixsRadioGenerate(part as matrixType,index),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.char.characterInfo.weapon[index].matrix[part as matrixType].name = newSelected;
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