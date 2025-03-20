import { Injectable } from '@angular/core';
import { StatsService, statTypes, matrixStat, MatrixService } from '.';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  
  constructor(
    private matrixs:MatrixService
  ) { }

  calc(weapons:weaponList[],enhancementShot:boolean=false){
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
          ssw.setVal(as as statTypes,((av as number[])[enhancementShot?6:w.advance])*ssw.getVal(as as statTypes));
        }
        matrixs.push(w.matrix);
        stat.add(ssw.getAll());
      }
    }
    let ssm = new StatsService();
    ssm.add(this.matrixs.calc(matrixs,enhancementShot));
    stat.add(ssm.getAll());
    let ssr = new StatsService();
    let activeReso = [];
    let overridden:string[] = [];
    for(let rw of reso){
      for(let r of rw){
        if(r.Cond.On=="Benedict"){
          const isBene = (wtype.map(w=>w=="Benedict").length);
          if(r.Cond.Number<=isBene){
            if(activeReso.findIndex(a=>a.name==r.Name)<0 && !overridden.includes(r.Name)){
              activeReso.push({name:r.Name,boost:r.Boost});
              for(let ov of r.Overrides){
                overridden.push(ov);
                const ovIdx = activeReso.findIndex(a=>a.name==ov);
                if(ovIdx>=0) activeReso.splice(ovIdx,1);
              }
            }
          }
        }
        if(r.Cond.On=="Element"){
          let isEle = 0;
          for(let wwe of wele){
            for(let w of wwe){
              if(w==r.Cond.What) isEle++;
            }
          }
          if(r.Cond.Number<=isEle){
            if(activeReso.findIndex(a=>a.name==r.Name)<0 && !overridden.includes(r.Name)){
              activeReso.push({name:r.Name,boost:r.Boost});
              for(let ov of r.Overrides){
                overridden.push(ov);
                const ovIdx = activeReso.findIndex(a=>a.name==ov);
                if(ovIdx>=0) activeReso.splice(ovIdx,1);
              }
            }
          }
        }
      }
    }
    for(let ar of activeReso){
      for(let [arstat,arval] of Object.entries(ar.boost)){
        ssr.addVal(arstat as statTypes,arval);
      }
    }
    stat.add(ssr.getAll());
    return stat.getAll();
  }
}

export type weaponResoType = "Attack"|"Benedict"|"Fortitude";
export type weaponElement = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
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
export const multiEleWeapons = ['Nola','Voidpiercer'];