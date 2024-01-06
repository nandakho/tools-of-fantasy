import { Component } from '@angular/core';
import { CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';

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
  constructor(
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