import { Injectable } from '@angular/core';
import { StatsService, statTypes, matrixStat, MatrixService } from '.';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  
  constructor(
    private matrixs:MatrixService
  ) { }

  calc(weapons:weaponList[]){
    let stat = new StatsService();
    let wtype = [];
    let wele = [];
    let reso = [];
    let matrixs = [];
    for(let w of weapons){
      if(w.name!=null){
        wtype.push(weaponAvailable[w.name].Type);
        wele.push(weaponAvailable[w.name].Element);
        let ssw = new StatsService();
        ssw.add(weaponAvailable[w.name].Base);
        if(weaponAvailable[w.name].Reso.length>0){
          reso.push(weaponAvailable[w.name].Reso);
        }
        for(let [s,v] of Object.entries(weaponAvailable[w.name].Upgrade)){
          ssw.addVal(s as statTypes,(v as number)*w.level);
        }
        for(let [as,av] of Object.entries(weaponAvailable[w.name].Ascend)){
          ssw.setVal(as as statTypes,((av as number[])[w.advance])*ssw.getVal(as as statTypes));
        }
        matrixs.push(w.matrix);
        stat.add(ssw.getAll());
      }
    }
    let ssm = new StatsService();
    ssm.add(this.matrixs.calc(matrixs));
    console.log("Matrixs (Included in Weapon):",ssm.getAll());
    stat.add(ssm.getAll());
    //reso to be added here
    return stat.getAll();
  }
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
  "Base": any; //mayupdate later
  "Upgrade": any; //mayupdate later
  "Ascend": any; //mayupdate later
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