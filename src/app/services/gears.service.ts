import { Injectable } from '@angular/core';
import { StatsService, statTypes } from '.';

@Injectable({
  providedIn: 'root'
})
export class GearsService {

  constructor() { }

  calc(gear:gearList){
    let stat = new StatsService();
    let randCount = new StatsService();
    for(let [k,v] of Object.entries(gear)){
      if(v.rarity!=null){
        for(let [kk,vv] of Object.entries(gearAvailable[k as gearTypes].Base)){
          stat.addVal(kk as statTypes,vv[v.rarity as gearRarity]);
        };
        for(let [kk,vv] of Object.entries(gearAvailable[k as gearTypes].Upgrade)){
          for(let i=0;i<v.enhance;i++){
            stat.addVal(kk as statTypes,vv[i]);
          }
        };
        const advLevel = Math.floor(v.enhance/5);
        for(let i=0;i<advLevel;i++){
          for(let [kk,vv] of Object.entries(gearAvailable[k as gearTypes].Advance[i])){
            stat.addVal(kk as statTypes,vv);
          }
        }
        for(let x of Object.values(v.random) as Array<randomStat>){
          if(x.type!=null){
            stat.addVal(x.type,x.val);
            if(rStatNeedCount.includes(x.type as statNeedCount) && this.needCount(x.type,x.val)) randCount.addVal(x.type,1);
          }
        }
      }
      if(v.rarity=="Augment"||v.rarity=="Titan"){
        for(let xx of Object.values(v.augment) as Array<randomStat>){
          if(xx.type!=null){
            stat.addVal(xx.type,xx.val);
            if(rStatNeedCount.includes(xx.type as statNeedCount)) randCount.addVal(xx.type,1);
          }
        }
      }
      if(v.rarity=="Titan" && v.rare.type!=null){
        stat.addVal(v.rare.type,v.rare.val);
      }
    }
    const combo = this.comboLevel(gear);
    if(combo!=null) stat.add(combo);
    for(let [rs,rv] of Object.entries(randCount.getAll())){
      /* Notes:
        Ok this one is kinda 'cheaty'.
        User won't know the 'exact' value of random stat that has been enhanced,
        since the value will always be shown rounded to nearest integer in game.
        (Yes you can find the exact value using packet sniffer, but not all user can or want to do that..)
        
        The workaround solution is to count how many times that random stat appear,
        divide it by 2, then rounding it down.
        Dividing by 2 to tolerate when said random value appear with value less or more than .5 (50:50 chance)),
        because of this workaround, there might be slight error (0-2 point of difference) in the final result.
        Well what can I do, the game hides the true value from user anyway ¯\_(ツ)_/¯
      */
      if(rv>0) stat.addVal(rs as statTypes,Math.floor(rv/2));
    }
    return stat.getAll();
  }

  needCount(type:statTypes,val:number){
    if(randStatNeedCount[type as statNeedCount]!=val) return true;
    return false;
  }

  comboLevel(gear:gearList){
    let lvl:number[] = [];
    for(let t of gearCombo){
      if(gear[t].rarity!=null){
        lvl.push(gear[t].enhance);
      }
    }
    lvl.sort((a,b)=>a-b);
    if(lvl.length==8){
      if(lvl[0]>=65) return gearComboStat[65];
      if(lvl[0]>=60) return gearComboStat[60];
      if(lvl[0]>=55) return gearComboStat[55];
      if(lvl[0]>=50) return gearComboStat[50];
      if(lvl[0]>=45) return gearComboStat[45];
      if(lvl[0]>=40) return gearComboStat[40];
      if(lvl[0]>=35) return gearComboStat[35];
      if(lvl[0]>=30) return gearComboStat[30];
      if(lvl[0]>=25) return gearComboStat[25];
      if(lvl[0]>=20) return gearComboStat[20];
      if(lvl[0]>=15) return gearComboStat[15];
      if(lvl[0]>=10) return gearComboStat[10];
      if(lvl[0]>=5) return gearComboStat[5];
    }
    return null;
  }
}

export const augAvailable = ["Bracers","Legguards","Sabatons","Armor","Handguards","Microreactor","Belt","Spaulders","Combat Engine","Eyepiece"];
export const randomStatList = {
  "Bracers": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Legguards": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Sabatons": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","Crit"],
  "Spaulders": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Armor": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Handguards": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","Crit"],
  "Belt": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Helm": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Exoskeleton": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","HPPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
  "Microreactor": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","HPPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
  "Eyepiece": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","HPPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent","AlterAttack","AlterResist","AlterResistPercent","CritPercent"],
  "Combat Engine": ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","HPPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
}
export const augStatList = {
  "Bracers": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Legguards": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Sabatons": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Spaulders": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Armor": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Handguards": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Belt": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Helm": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP"],
  "Exoskeleton": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
  "Microreactor": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
  "Eyepiece": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
  "Combat Engine": ["FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent"],
}
export const titanStatList = {
  "Bracers": ["Delay","Heal","Skill","Discharge","Damage","Weak"],
  "Legguards": ["Lifesteal","Recovery","Block","Reduction","Normal","Dodge"],
  "Sabatons": ["Lifesteal","Recovery","Block","Reduction","Normal","Skill"],
  "Spaulders": ["Delay","Heal","Normal","Discharge","Damage","Weak"],
  "Armor": ["Delay","Heal","Dodge","Discharge","Damage","Weak"],
  "Handguards": ["Delay","Heal","Normal","Skill","Damage","Weak"],
  "Belt": ["Lifesteal","Recovery","Block","Reduction","Dodge","Skill"],
  "Helm": [],
  "Exoskeleton": [],
  "Microreactor": ["Lifesteal","Recovery","Block","Reduction","Dodge","Discharge"],
  "Eyepiece": ["Lifesteal","Recovery","Block","Reduction","Normal","Discharge"],
  "Combat Engine": ["Delay","Heal","Dodge","Skill","Damage","Weak"],
}

export interface gear {
  type: gearTypes;
  rarity: gearRarity;
}

export type gearTypes = gearTypesNormal|gearTypesSpecial;
type gearTypesNormal = "Helm"|"Armor"|"Belt"|"Legguards"|"Bracers"|"Spaulders"|"Sabatons"|"Handguards";
type gearTypesSpecial = "Eyepiece"|"Combat Engine"|"Exoskeleton"|"Microreactor";
type gearRarity = "5"|"Augment"|"Titan";

type element = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";

/**
 * `type` only includes augment that matters in this calculator (at least for now):  
 * - `attack`: Your plain old attack that boost all elements  
 * - `eleAttack`: Stat that boost a certain elemental attack value  
 * - `eleAttackPercent`: A cooler eleAttack, that boost it with percentage value
 */
export interface augStat {
  attack: number;
  eleAttack: number;
  eleAttackPercent: number;
}

/**
 * Consider all equipment has same enhancement value and rarity,  
 * so all equipment will have same `baseAtk`, `enhanceAtk`, and `bonusAtk`  
 * - `baseAtk`: Is the main plain Attack stat in your equipment  
 * - `enhanceAtk`: The plus attack value right beside your base attack  
 * - `bonusAtk`: Bonus attack value gained from enhancement (usually per 5 levels)  
 */
export interface basicStat {
  baseAtk: number;
  enhanceAtk: number;
  bonusAtk: number;
}

//Update below, interface for my-char
type eleAttack = "FlameAttack"|"FrostAttack"|"PhysicalAttack"|"VoltAttack";
type eleAttackPercent = "FlameAttackPercent"|"FrostAttackPercent"|"PhysicalAttackPercent"|"VoltAttackPercent";
type eleDamagePercent = "FlameDamagePercent"|"FrostDamagePercent"|"PhysicalDamagePercent"|"VoltDamagePercent";
type eleResist = "FlameResist"|"FrostResist"|"PhysicalResist"|"VoltResist";
type eleResistPercent = "FlameResistPercent"|"FrostResistPercent"|"PhysicalResistPercent"|"VoltResistPercent";
type basicRandomStat = "Attack"|eleAttack|"Resist"|eleResist|"HP";
type critPieceRandomStat = basicRandomStat|"Crit";
type specialRandomStat = basicRandomStat|eleAttackPercent|eleResistPercent|"HPPercent"|eleDamagePercent;
type eyepieceRandomStat = specialRandomStat|"AlterAttack"|"AlterResist"|"AlterResistPercent"|"CritPercent";
type possibleBaseStat = "HP"|"Attack"|"Resist"|"Crit";
type possibleAugStat = specialRandomStat;
type possibleRareStat = "Delay"|"Heal"|"Normal"|"Skill"|"Damage"|"Weak"|"Dodge"|"Discharge"|"Lifesteal"|"Recovery"|"Block"|"Reduction"

type randomStat = {
  type: eyepieceRandomStat|null;
  val: number;
}
type rareStat = {
  type: possibleRareStat|null;
  val: number;
}
export interface gearList {
  "Bracers": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Legguards": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Sabatons": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Spaulders": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Armor": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Handguards": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Belt": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Helm": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  },
  "Exoskeleton": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  }, 
  "Microreactor": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  }, 
  "Eyepiece": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  }, 
  "Combat Engine": {
    rarity: eqRarity|null,
    random: randomStat[],
    augment: randomStat[],
    rare: rareStat,
    enhance: number
  }
}
export type eqRarity = "5"|"Augment"|"Titan";
export type baseGear = {
  [t in gearTypes]: {
    "Base": {
      [s in possibleBaseStat]?: {[r in eqRarity]: number}
    };
    "Upgrade": {
      [s in possibleBaseStat]?: number[]
    };
    "Advance": [{
      [s in possibleBaseStat]?: number
    }]
  }
}
type statNeedCount = "Attack"|"AlterAttack"|"AlterResist"|"Crit"|"FlameAttack"|"FlameResist"|"FrostAttack"|"FrostResist"|"HP"|"PhysicalAttack"|"PhysicalResist"|"Resist"|"VoltAttack"|"VoltResist";
type needCount = {
  [stat in statNeedCount]:number
}
export const rStatNeedCount:statNeedCount[] = ["Attack","AlterAttack","AlterResist","Crit","FlameAttack","FlameResist","FrostAttack","FrostResist","HP","PhysicalAttack","PhysicalResist","Resist","VoltAttack","VoltResist"];
export const gearAvailable:baseGear = require("./tables/equipmentStat.json");
export const randStatNeedCount:needCount = {
  "Attack":52,
  "AlterAttack":137,
  "AlterResist":215,
  "Crit":258,
  "FlameAttack":69,
  "FlameResist":215,
  "FrostAttack":69,
  "FrostResist":215,
  "HP":4125,
  "PhysicalAttack":69,
  "PhysicalResist":215,
  "Resist":64,
  "VoltAttack":69,
  "VoltResist":215
};
export const gearCombo:gearTypes[] = ["Bracers","Legguards","Sabatons","Spaulders","Armor","Handguards","Belt","Helm"];
type comboLevel = "5"|"10"|"15"|"20"|"25"|"30"|"35"|"40"|"45"|"50"|"55"|"60"|"65";
export type comboStat = {
  [lv in comboLevel]: {
    "Attack":number;
    "Resist":number;
    "HP":number;
    "Crit":number;
  }
}
export const gearComboStat:comboStat = require("./tables/equipmentComboStat.json");