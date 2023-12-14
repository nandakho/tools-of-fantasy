import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }
}

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