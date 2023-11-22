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
export interface augmentStat {

}

type aaaaa = {
  [stat in possibleAugStat]: number;
}

type bbbbb = {
  [rare in possibleRareStat]: number
}

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
type possibleAugStat = "";
type possibleRareStat = "";

export interface equipmentStat {
  "Bracers"?: {[type in basicRandomStat]:number},
  "Legguards"?: {[type in basicRandomStat]:number},
  "Sabatons"?: {[type in critPieceRandomStat]:number},
  "Spaulders"?: {[type in basicRandomStat]:number},
  "Armor"?: {[type in basicRandomStat]:number},
  "Handguards"?: {[type in critPieceRandomStat]:number},
  "Belt"?: {[type in basicRandomStat]:number},
  "Helm"?: {[type in basicRandomStat]:number},
  "Exoskeleton"?: {[type in specialRandomStat]:number},
  "Microreactor"?: {[type in specialRandomStat]:number},
  "Eyepiece"?: {[type in eyepieceRandomStat]:number},
  "Combat Engine"?: {[type in specialRandomStat]:number}
}

export type eqRarity = "5"|"Augment"|"Titan";
export type baseStat = {
  [t in gearTypes]: {[s in possibleBaseStat]?: {[r in eqRarity]: number}}
}
export const baseStatList:baseStat = require("./tables/equipmentStat.json");

type randomStat = {[type in eyepieceRandomStat]:number};
export interface gearStat {
  rarity: eqRarity;
  randomStat: randomStat;
  augStat: augmentStat;
  enhance: number;
}