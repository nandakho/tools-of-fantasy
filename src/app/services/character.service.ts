import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { augStat, baseStat, equipmentStat, gear, gearTypes, randomStat } from '.';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public characterInfo: characterInfo|null = null;
  constructor() {
    this.loadStat();
  }

  async loadStat(){
    const c = await Preferences.get({key:`character`});
    this.characterInfo = JSON.parse(c.value??"null");
    console.log(this.characterInfo);
  }

  async saveStat(){
    await Preferences.set({key:`character`,value:JSON.stringify(this.characterInfo)});
  }
}

export interface characterInfo {
  uid: number|null;
  name: string|null;
  weapon: weaponList[];
  equipment: equipmentStat;
}

type atkType = "Attack"|"Fortitude"|"Benediction";
export interface weaponList {
  name: string;
  type: atkType;
  level: number;
  advance: number;
}

type gearList = {
  [str in gearTypes]: gearStat
}

interface gearStat {
  rarity: "5"|"Augmented"|"Titan";
  baseStat: baseStat;
  randomStat: randomStat;
  augStat: augStat;
}