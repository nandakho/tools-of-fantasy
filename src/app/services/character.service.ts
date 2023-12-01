import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { augmentStat, baseStat, equipmentStat, gear, gearTypes, baseStatList, weaponAvailable } from '.';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public characterInfo: characterInfo|null = null;
  constructor() {
    this.loadStat();
    console.log(baseStatList);
    console.log(weaponAvailable);
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
  equipment: gearList;
}

export interface weaponList {
  name: string;
  level: number;
  advance: number;
}

type gearList = {
  [str in gearTypes]: number
}