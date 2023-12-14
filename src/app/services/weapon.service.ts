import { Injectable } from '@angular/core';
import { matrixStat } from '.';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  
  constructor() { }
}

type weaponResoType = "Attack"|"Benedict"|"Fortitude";
type weaponElement = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
type weaponResonance = {
  "Name": string;
  "Cond": resoCondition;
  "Boost": {[boost:string]:number};
  "Overrides": string[];
}
type resoCondition = {
    "On": "Element"|"Benedict",
    "What": weaponElement,
    "Number": number
}
type baseStat = {
  "Type": weaponResoType;
  "Element": weaponElement[];
  "Reso": weaponResonance[];
  "Base": any;
}

export interface weaponList {
  name: string|null;
  level: number;
  advance: number;
  matrix: matrixStat;
}
export interface baseWeap {
  [weaponName:string]: baseStat;
}
export const weaponAvailable:baseWeap = require("./tables/weaponStat.json");