import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GearsService {

  constructor() { }
}

/**
 * For now this is only used for frontend icon
 */
export interface gear {
  type: gearTypesNormal|gearTypesSpecial;
  icon?: string;
}

type gearTypesNormal = "Helm"|"Armor"|"Belt"|"Legguards"|"Bracers"|"Spaulders"|"Sabatons"|"Handguards";
type gearTypesSpecial = "Eyepiece"|"Combat Engine"|"Exoskeleton"|"Microreactor";

/**
 * `type` only includes augment that matters in this calculator (at least for now):  
 * - `attack`: Your plain old attack that boost all elements  
 * - `eleAttack`: Stat that boost a certain elemental attack value  
 * - `eleAttackPercent`: A cooler eleAttack, that boost it with percentage value
 */
export interface augStat {
  type: "attack"|"eleAttack"|"eleAttackPercent";
  value: number;
}