import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AlertInput } from '@ionic/angular';
import { MiscService, augStat, basicStat, gear, gearTypes } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage {
  url: string|null = '';
  elementSelected:elementAvailable = "Flame";
  elementAvailable:elementAvailable[] = ["Flame","Frost","Physical","Volt","Altered"];
  gearSelected: gear = {
    type: "Helm",
    rarity: "5"
  };
  gearAvailable: gearTypes[] = ["Helm","Armor","Belt","Legguards","Bracers","Spaulders","Sabatons","Handguards","Eyepiece","Combat Engine","Exoskeleton","Microreactor"];
  sharedStats:basicStat = {
    baseAtk: 0,
    enhanceAtk: 0,
    bonusAtk: 0
  }
  yourStats:pStats = {
    baseAtk: 0,
    bonusAtk: 0
  }
  equipment: eqStats[] = [];
  equipped: number|undefined = undefined;
  helpGif: any = undefined;
  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private alert: AlertController,
    private misc: MiscService
  ) {
    this.serverSide();
  }

  validLength(length:number): boolean {
    length-=11;
    return length<0?false:length%3==0;
  }

  parseEq(data:string[], many:number): void {
    for (let i = 0; i < many; i++) {
      this.addEquipment(parseFloat(data[8+(3*i)]),parseFloat(data[9+(3*i)]),parseFloat(data[10+(3*i)]));
    }
  }

  serverSide(){
    this.url = this.route.snapshot.paramMap.get('attr');
    if(this.url){
      const attr = this.url.split("_");
      this.elementSelected = this.elementAvailable[(parseInt(attr?.[0])||0)<this.elementAvailable.length?(parseInt(attr?.[0])||0):0];
      this.gearSelected = {
        type: this.gearAvailable[(parseInt(attr?.[1])||0)<this.gearAvailable.length?(parseInt(attr?.[1])||0):0],
        rarity: "5"
      }
      if(this.validLength(attr?.length||0)){
        this.yourStats = {
          baseAtk: parseInt(attr[2])||0,
          bonusAtk: parseInt(attr[3])||0
        }
        this.sharedStats = {
          baseAtk: parseInt(attr[4])||0,
          enhanceAtk: parseInt(attr[5])||0,
          bonusAtk: parseInt(attr[6])||0
        }
        const many = (attr.length-9)/3;
        this.parseEq(attr, many);
        const eqpd = parseInt(attr[7]);
        this.equipped = Number.isNaN(eqpd)?undefined:eqpd<many?eqpd:undefined;
        this.recalcEquip("all");
      }
    }
    this.setTag();
  }

  setTag(){
    var desc = ``;
    const attr = this.url?.split("_");
    if(this.validLength(attr?.length||0)){
      const many = ((attr?.length??0)-9)/3;
      desc += `Check my gear!`;
      for (let i = 0; i < many; i++) {
        desc += `\nGear #${i+1}: Attack ${this.equipment[i].attack}, ${this.elementSelected} Attack ${this.equipment[i].eleAttack} + ${this.equipment[i].eleAttackPercent}%, Total Attack: ${this.equipment[i].calculated.total} (Gain ${this.equipment[i].calculated.gain})`;
      }
    } else {
      desc += `Let's find out which gear boost more of your attack!\nIs it the high flat attack one or the percent one?`;
    }
    this.title.setTitle(`Tools of Fantasy - Gear Compare`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: `/gear-compare${this.url?'/'+this.url:''}` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `Tools of Fantasy - Gear Compare` });
    this.meta.updateTag({ property: 'og:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: `Tools of Fantasy - Gear Compare` });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
  }

  eleRadioGenerate(){
    var r:AlertInput[] = [];
    for(let i = 0; i<this.elementAvailable.length; i++){
      r.push({
        label: this.elementAvailable[i],
        type:"radio",
        value: this.elementAvailable[i],
        checked: this.elementAvailable[i]==this.elementSelected,
        cssClass: `element-${this.elementAvailable[i]}`
      });
    }
    return r;
  }

  gearRadioGenerate(){
    var r:AlertInput[] = [];
    for(let i = 0; i<this.gearAvailable.length; i++){
      r.push({
        label: this.gearAvailable[i],
        type:"radio",
        value: this.gearAvailable[i],
        checked: this.gearAvailable[i]==this.gearSelected.type,
        cssClass: `gear-${this.gearAvailable[i].replace(" ","-")}`
      });
    }
    return r;
  }

  async changeElement(){
    const alert = await this.alert.create({
      header: "Select Element",
      backdropDismiss: true,
      inputs: this.eleRadioGenerate(),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.elementSelected = newSelected;
        }
      }]
    });
    alert.present();
  }

  async changeGear(){
    const alert = await this.alert.create({
      header: "Select Gear",
      backdropDismiss: true,
      inputs: this.gearRadioGenerate(),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.gearSelected.type = newSelected;
        }
      }]
    });
    alert.present();
  }

  async showHelp(section:any){
    const img = `assets/help/${section}.gif`;
    this.helpGif = img;
    return Promise.resolve();
  }

  async hideHelp(){
    this.helpGif = undefined;
    return Promise.resolve();
  }

  async help(section:string){
    const notice = await this.alert.create({
      cssClass: `help-popup-${section}`,
      backdropDismiss: true
    });
    notice.present();
  }

  changeEquipped(){
    this.recalcEquip("all");
  }

  addEquipment(atk?:number,eleAtk?:number,eleAtkPct?:number){
    this.equipment.push({attack:atk||0,eleAttack:eleAtk||0,eleAttackPercent:eleAtkPct||0,calculated:this.calcAtk(atk||0,eleAtk||0,eleAtkPct||0)});
  }

  removeEquipment(index:number){
    if(index == this.equipped){
      this.equipped = undefined;
    }
    this.equipment.splice(index,1);
    this.recalcEquip("all");
  }

  recalcEquip(i:number|"all"){
    if(i=="all"){
      if(this.equipment.length>0){
        for(let id=0;id<this.equipment.length;id++){
          this.equipment[id].calculated = this.calcAtk(this.equipment[id].attack,this.equipment[id].eleAttack,this.equipment[id].eleAttackPercent);
        }
      }
    } else {
      this.equipment[i].calculated = this.calcAtk(this.equipment[i].attack,this.equipment[i].eleAttack,this.equipment[i].eleAttackPercent);
    }
  }

  calcAtk(eqAtk:number,eqEleAtk:number,eqElePercent:number){
    const curPercent = this.yourStats.baseAtk!=0?this.yourStats.bonusAtk/this.yourStats.baseAtk:0;
    const basePercent = this.equipped!=undefined?(curPercent - (this.equipment[this.equipped].eleAttackPercent/100)):curPercent;
    const sharedAtk = (this.sharedStats.baseAtk+this.sharedStats.bonusAtk+this.sharedStats.enhanceAtk);
    const baseAtk = this.equipped!=undefined?(this.yourStats.baseAtk - (this.equipment[this.equipped].attack+this.equipment[this.equipped].eleAttack) - sharedAtk):this.yourStats.baseAtk;
    const eqFinAtk = eqAtk+eqEleAtk;
    const rBase = baseAtk+sharedAtk+eqFinAtk;
    const rPercent = Math.ceil(rBase*((eqElePercent/100)+basePercent));
    const rTotal = rBase+rPercent;
    const rGain = rTotal-(Math.ceil(baseAtk*basePercent))-(baseAtk);
    const result = {
      base: rBase,
      percent: rPercent,
      total: rTotal,
      gain: rGain
    }
    return result;
  }

  generateURL(): string {
    var segment = [];
    segment.push(this.elementAvailable.indexOf(this.elementSelected));
    segment.push(this.gearAvailable.indexOf(this.gearSelected.type));
    segment.push(this.yourStats.baseAtk);
    segment.push(this.yourStats.bonusAtk);
    segment.push(this.sharedStats.baseAtk);
    segment.push(this.sharedStats.enhanceAtk);
    segment.push(this.sharedStats.bonusAtk);
    segment.push(this.equipped);
    for (let i = 0; i < this.equipment.length; i++) {
      segment.push(this.equipment[i].attack);
      segment.push(this.equipment[i].eleAttack);
      segment.push(this.equipment[i].eleAttackPercent);
    }
    return segment.join("_");
  }

  urlShare(){
    var desc = `Check out my gear comparison!\n\nMy Stats:\n${this.elementSelected} Attack: ${this.yourStats.baseAtk} + ${this.yourStats.bonusAtk}\n\nGear Enhance:\nBase Attack: ${this.sharedStats.baseAtk}\nAttack Enhancement: ${this.sharedStats.enhanceAtk}\nEnhancement Unlocked (Attack): ${this.sharedStats.bonusAtk}\n`;
    for (let i = 0; i < this.equipment.length; i++) {
      desc += `\nGear #${i+1}${this.equipped==i?` (Equipped)`:``}:\nAttack: ${this.equipment[i].attack}\n${this.elementSelected} Attack: ${this.equipment[i].eleAttack} + ${this.equipment[i].eleAttackPercent}%\nTotal Attack: ${this.equipment[i].calculated.base} + ${this.equipment[i].calculated.percent} = ${this.equipment[i].calculated.total}\nAttack Gain: ${this.equipment[i].calculated.gain}\n`;
    }
    desc += `\nMore info or calculate your own at:`;
    const url = `https://tof.nandakho.my.id/gear-compare/${this.generateURL()}`;
    navigator.clipboard.writeText(`${desc}\n${url}`);
    this.misc.showToast(`Copied to clipboard!`);
  }
}

type elementAvailable = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
type pStats = {
  baseAtk: number,
  bonusAtk: number
}
interface eqStats extends augStat {
  calculated: {
    base: number;
    percent: number;
    total: number;
    gain: number
  };
}