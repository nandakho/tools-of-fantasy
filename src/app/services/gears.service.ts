import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GearsService {

  constructor() { }
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

export interface gearList {
  "Bracers"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]?:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Legguards"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]?:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Sabatons"?: {
    rarity: eqRarity,
    random: {[type in critPieceRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Spaulders"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Armor"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Handguards"?: {
    rarity: eqRarity,
    random: {[type in critPieceRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Belt"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Helm"?: {
    rarity: eqRarity,
    random: {[type in basicRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  },
  "Exoskeleton"?: {
    rarity: eqRarity,
    random: {[type in specialRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  }, 
  "Microreactor"?: {
    rarity: eqRarity,
    random: {[type in specialRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  }, 
  "Eyepiece"?: {
    rarity: eqRarity,
    random: {[type in eyepieceRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  }, 
  "Combat Engine"?: {
    rarity: eqRarity,
    random:  {[type in specialRandomStat]:number},
    augment: {[aug in possibleAugStat]?:number}|null,
    rare: {[rare in possibleRareStat]?:number}|null,
    enhance: number
  }
}
export type eqRarity = "5"|"Augment"|"Titan";
export type baseGear = {
  [t in gearTypes]: {[s in possibleBaseStat]?: {[r in eqRarity]: number}}
}
export const baseStatList:baseGear = require("./tables/equipmentStat.json");