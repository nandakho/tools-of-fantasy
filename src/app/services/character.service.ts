import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { gearList, baseStatList, weaponList, weaponAvailable } from '.';

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
    this.characterInfo = JSON.parse(c.value??"null")??{
      uid: `100001`,
      name: `Testing`,
      server: "Southeast Asia",
      weapon: [{name:null,advance:0,level:0,matrix:[]},{name:null,advance:0,level:0,matrix:[]},{name:null,advance:0,level:0,matrix:[]}],
      gear: {
        Bracers: {
          rarity: "5",
          random: {
            Attack: 52,
            VoltAttack: 69,
            HP: 600,
            PhysicalAttack: 69
          },
          augment: null,
          rare: null,
          enhance: 20
        }
      },
      supre: null,
      drugs: {atk:0,hp:0},
      simul: {"4500":0,"5500":0,"7000":0}
    };
    console.log(this.characterInfo);
  }

  async saveStat(){
    await Preferences.set({key:`character`,value:JSON.stringify(this.characterInfo)});
  }
}

type drugTaken = {
  atk: number;
  hp: number;
}
type simulActive = {
  "4500": number;
  "5500": number;
  "7000": number;
}
type serverList = "Asia Pacific"|"Europe"|"North America"|"South America"|"Southeast Asia";
export interface characterInfo {
  uid: string|null;
  name: string|null;
  server: serverList|null;
  weapon: weaponList[];
  gear: gearList|null;
  supre: string|null;
  drugs: drugTaken;
  simul: simulActive;
}