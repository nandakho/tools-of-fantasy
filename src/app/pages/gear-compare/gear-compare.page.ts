import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
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
  constructor() { }

  async ionViewWillEnter(){
    console.log("HAI");
    try {
      const data = await this.readStorage();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  changeElement(){
    console.log(`Popup element selection here!`);
  }

  changeType(){
    console.log(`Popup equipment selection here!`);
  }

  help(section:string){
    console.log(`Popup help about: ${section}`);
  }

  addEquipment(){
    this.equipment.push({attack:0,eleAttack:0,eleAttackPercent:0,totalAttack:0});
  }

  removeEquipment(index:number){
    this.equipment.splice(index,1);
    console.log(this.equipment);
  }

  async readStorage(){
    try {
      const data = await Preferences.get({key:"stats"});
      return Promise.resolve(data);
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