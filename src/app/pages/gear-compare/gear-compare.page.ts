import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, AlertInput, AlertOptions } from '@ionic/angular';
import { augStat, gear, gearTypes } from 'src/app/services';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage {
  elementSelected:elementAvailable = "Flame";
  elementAvailable:elementAvailable[] = ["Flame","Frost","Physical","Volt","Altered"];
  gearSelected: gearTypes = "Combat Engine";
  gearAvailable: gearTypes[] = ["Helm","Armor","Belt","Legguards","Bracers","Spaulders","Sabatons","Handguards","Eyepiece","Combat Engine","Exoskeleton","Microreactor"];
  sharedStats = {
    baseAtk: 0,
    enhanceAtk: 0,
    bonusAtk: 0
  }
  yourStats:pStats = {
    baseAtk: 0,
    bonusAtk: 0
  }
  equipment: eqStats[] = [];
  constructor(
    private alert: AlertController
  ) { }

  async ionViewWillEnter(){
    //This is for future update cz i'm lazy lol
    //load last input stats automatically on page load
    try {
      const data = await this.readStorage();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  eleRadioGenerate(){
    var r:AlertInput[] = [];
    for(let i = 0; i<this.elementAvailable.length; i++){
      r.push({
        label: this.elementAvailable[i],
        type:"radio",
        value: this.elementAvailable[i],
        checked: this.elementAvailable[i]==this.elementSelected
      });
    }
    return r;
  }

  async changeElement(){
    const alert = await this.alert.create({
      header: "Select Element",
      backdropDismiss: true,
      inputs: this.eleRadioGenerate(),
      buttons: [{
        text:'OK',
        handler: async (newSelected)=>{
          this.elementSelected = newSelected;
        }
      },{
        text:'Cancel'
      }]

    });
    alert.present();
  }

  changeType(){
    console.log(`Popup equipment selection here!`);
  }

  help(section:string){
    console.log(`Popup help about: ${section}`);
  }

  addEquipment(){
    this.equipment.push({attack:0,eleAttack:0,eleAttackPercent:0,totalAttack:this.calcAtk(0,0,0)});
  }

  removeEquipment(index:number){
    this.equipment.splice(index,1);
  }

  recalcEquip(i:number|"all"){
    if(i=="all"){
      if(this.equipment.length>0){
        for(let id=0;id<this.equipment.length;id++){
          this.equipment[id].totalAttack = this.calcAtk(this.equipment[id].attack,this.equipment[id].eleAttack,this.equipment[id].eleAttackPercent);
        }
      }
    } else {
      this.equipment[i].totalAttack = this.calcAtk(this.equipment[i].attack,this.equipment[i].eleAttack,this.equipment[i].eleAttackPercent);
    }
  }

  calcAtk(eqAtk:number,eqEleAtk:number,eqElePercent:number){
    const curPercent = this.yourStats.bonusAtk/this.yourStats.baseAtk;
    const a = this.yourStats.baseAtk+(this.sharedStats.baseAtk+this.sharedStats.bonusAtk+this.sharedStats.enhanceAtk);
    const b = eqAtk+eqEleAtk;
    const result = Math.ceil((a+b)*(1+(eqElePercent/100)+curPercent));
    return result;
  }

  async readStorage(){
    try {
      const data = await Preferences.get({key:"gear_compare"});
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async saveStorage(data:string){
    try {
      await Preferences.set({key:"gear_compare",value:data});
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

type elementAvailable = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
type pStats = {
  baseAtk: number,
  bonusAtk: number
}
interface eqStats extends augStat {
  totalAttack: number;
}