import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  
  constructor() { }
}

export const weaponAvailable = require("./tables/weaponStat.json");