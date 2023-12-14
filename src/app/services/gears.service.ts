import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GearsService {

  constructor() { }
}

export const augAvailable = ["Bracers","Legguards","Sabatons","Armor","Handguards","Microreactor"];
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
export const titanStatList = {
  "Bracers": ["Delay","Heal","Skill","Discharge","Damage","Weak"],
  "Legguards": ["Lifesteal","Recovery","Block","Reduction","Normal","Dodge"],
  "Sabatons": ["Lifesteal","Recovery","Block","Reduction","Normal","Skill"],
  "Spaulders": [],
  "Armor": ["Delay","Heal","Dodge","Discharge","Damage","Weak"],
  "Handguards": ["Delay","Heal","Normal","Skill","Damage","Weak"],
  "Belt": [],
  "Helm": [],
  "Exoskeleton": [],
  "Microreactor": ["Lifesteal","Recovery","Block","Reduction","Dodge","Discharge"],
  "Eyepiece": [],
  "Combat Engine": [],
}

export interface gear {
  type: gearTypes;
  rarity: gearRarity;
}

export type gearTypes = gearTypesNormal|gearTypesSpecial;
type gearTypesNormal = "Helm"|"Armor"|"Belt"|"Legguards"|"Bracers"|"Spaulders"|"Sabatons"|"Handguards";
type gearTypesSpecial = "Eyepiece"|"Combat Engine"|"Exoskeleton"|"Microreactor";
type gearRarity = "5"|"Augmented"|"Titan";

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
    }
  }
}
export const gearAvailable:baseGear = require("./tables/equipmentStat.json");