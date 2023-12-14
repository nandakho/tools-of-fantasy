import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { gearList, weaponList, weaponAvailable } from '.';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public characterInfo: characterInfo = {
    uid: null,
    name: null,
    server: null,
    weapon: [
      {name:null,advance:0,level:1,matrix:{
        "Mind":{name:null,level:0,advance:0},
        "Memory":{name:null,level:0,advance:0},
        "Faith":{name:null,level:0,advance:0},
        "Emotion":{name:null,level:0,advance:0}}
      },
      {name:null,advance:0,level:1,matrix:{
        "Mind":{name:null,level:0,advance:0},
        "Memory":{name:null,level:0,advance:0},
        "Faith":{name:null,level:0,advance:0},
        "Emotion":{name:null,level:0,advance:0}}
      },
      {name:null,advance:0,level:1,matrix:{
        "Mind":{name:null,level:0,advance:0},
        "Memory":{name:null,level:0,advance:0},
        "Faith":{name:null,level:0,advance:0},
        "Emotion":{name:null,level:0,advance:0}}
      }
    ],
    gear: {
      "Bracers": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Legguards": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Sabatons": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Spaulders": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Armor": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Handguards": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Belt": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Helm": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      },
      "Exoskeleton": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      }, 
      "Microreactor": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      }, 
      "Eyepiece": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      }, 
      "Combat Engine": {
        rarity: null,
        random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
        augment: [{type:null,val:0},{type:null,val:0}],
        rare: {type:null,val:1},
        enhance: 0
      }
    },
    supre: null,
    shots: {powerShot:0,sourceShot:0},
    simul: {"4500":0,"5500":0,"7000":0}
  };
  constructor() {
    this.loadStat();
  }

  async loadStat(){
    const c = await Preferences.get({key:`character`});
    const info = JSON.parse(c.value??"null");
    if(info!=null){
      this.characterInfo = info;
    }
  }

  async saveStat(){
    await Preferences.set({key:`character`,value:JSON.stringify(this.characterInfo)});
  }
}

export const shotIncrease = {
  powerShot:{"Attack":25.0},
  sourceShot:{"HP":1200.0}
}
type shotTaken = {
  powerShot: number;
  sourceShot: number;
}
export const simulIncrease = {
  "4500":{"HP":7600.0},
  "5500":{"Attack":25.0,"HP":2000.0},
  "7000":{"Attack":55.0}
}
type simulActive = {
  "4500": number;
  "5500": number;
  "7000": number;
}
export type serverList = "Asia Pacific"|"Europe"|"North America"|"South America"|"Southeast Asia";
export interface characterInfo {
  uid: string|null;
  name: string|null;
  server: serverList|null;
  weapon: weaponList[];
  gear: gearList;
  supre: string|null;
  shots: shotTaken;
  simul: simulActive;
}
type supreStat = {
  [name:string]:{
    [stat:string]:number;
  }
}
export const supreAvailable:supreStat = require("./tables/supreStat.json");