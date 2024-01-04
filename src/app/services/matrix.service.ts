import { Injectable } from '@angular/core';
import { StatsService, statTypes } from '.';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }

  calc(matrixs:matrixStat[]){
    let stat = new StatsService();
    let sets: matrixSet[] = [];
    for(let [mIdx,matrix] of matrixs.entries()){
      for(let [slot,mstat] of Object.entries(matrix)){
        if(mstat.name!=null){
          let sm = new StatsService();
          sm.add(matrixAvailable.Base[slot as matrixType]);
          for(let [s,v] of Object.entries(matrixAvailable.Upgrade[slot as matrixType])){
            sm.addVal(s as statTypes,(v as number)*mstat.level);
          }
          sm.multiplyAll(matrixAvailable.Ascend[mstat.advance]);

          let sIdx = sets.findIndex(x=>x.name==mstat.name);
          if(sIdx<0){
            sets.push({name:mstat.name,count:{0:[0,0,0],1:[0,0,0],2:[0,0,0],3:[0,0,0]}})
          }
          sIdx = sets.findIndex(x=>x.name==mstat.name);
          sets[sIdx].count[mstat.advance as ascend][mIdx]+=1;
          stat.add(sm.getAll());
        }
      }
    }
    let msets = sets.map(x=>{
      const count = {
        0: x.count[0].sort((a,b)=>b-a)[0],
        1: x.count[1].sort((a,b)=>b-a)[0],
        2: x.count[2].sort((a,b)=>b-a)[0],
        3: x.count[3].sort((a,b)=>b-a)[0]
      }
      const filtered = (Object.values(count).map((val,idx)=>{return {ascend:idx,count:val}})).sort((x,y)=>y.count-x.count)[0];
      return {
        name: x.name,
        ascend: filtered.ascend,
        count: filtered.count
      }
    })

    let allSetStat = new StatsService();
    for(let val of Object.values(msets)){
      let pieceSet = new StatsService();
      if(matrixAvailable.Special[val.name]?.Set<=val.count){
        for(let bstat of matrixAvailable.Special[val.name].Increase){
          pieceSet.addVal(bstat as statTypes,matrixAvailable.Special[val.name].Value[val.ascend]);
        }
      }
      allSetStat.add(pieceSet.getAll());
    }
    stat.add(allSetStat.getAll());
    return stat.getAll();
  }
}

type mset = {
  [adv in ascend]: number[];
}
type matrixSet = {
  name: string;
  count: mset;
}
type ascend = 0|1|2|3;
export type matrixType = "Mind"|"Memory"|"Faith"|"Emotion";
type baseStat = "HP"|"Attack"|"Resist"|"Crit";
type specialMatrix = {
  [name:string]: {
    "Set":number;
    "Increase":string[];
    "Value":number[];
  }
}
export type matrixStat = {
  [type in matrixType]:{
    name: string|null;
    level: number;
    advance: number;
  }
}
export type matrix = {
  "Base":{[mtype in matrixType]:{[stat in baseStat]?:number}};
  "Upgrade":{[mtype in matrixType]:{[stat in baseStat]?:number}};
  "Ascend":number[];
  "List":string[];
  "Special":specialMatrix;
}
export const matrixAvailable:matrix = require("./tables/matrixStat.json");