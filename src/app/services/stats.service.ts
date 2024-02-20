import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private stats:stats = {};
  constructor() {
    this.initAll();
  }

  init(what:statTypes):void{
    this.setVal(what,0);
  }
  
  initAll():void{
    for(const t of typeList){
      Object.assign(this.stats,{[t]:0});
    }
  }

  add(stats:stats):void{
    for(let [k,v] of Object.entries(stats)){
      this.addVal(k as statTypes,v);
    }
  }

  sub(stats:stats):void{
    for(let [k,v] of Object.entries(stats)){
      this.addVal(k as statTypes,-(v));
    }
  }

  addVal(what:statTypes,val:number):void{
    this.stats[what] = (this.stats[what]??0)+val;
  }

  multiplyAll(val:number):void{ 
    for(let [k,v] of Object.entries(this.stats)){
      this.setVal(k as statTypes,(v*val));
    }
  }
  
  setVal(what:statTypes,val:number):void{
    this.stats[what] = val;
  }
  
  getVal(what:statTypes):number{
    return this.stats[what]??0;
  }

  getAll():stats{
    return this.stats;
  }
}

export const typeList: statTypes[] = ["Attack","FlameAttack","FrostAttack","PhysicalAttack","VoltAttack","Resist","FlameResist","FrostResist","PhysicalResist","VoltResist","Crit","HP","FlameAttackPercent","FrostAttackPercent","PhysicalAttackPercent","VoltAttackPercent","FlameResistPercent","FrostResistPercent","PhysicalResistPercent","VoltResistPercent","HPPercent","FlameDamagePercent","FrostDamagePercent","PhysicalDamagePercent","VoltDamagePercent","AlterAttack","AlterResist","AlterResistPercent","CritPercent","Delay","Heal","Skill","Discharge","Damage","Weak","Lifesteal","Recovery","Block","Reduction","Normal","Dodge","CritDamage"];
export type statTypes = "Attack"|"FlameAttack"|"FrostAttack"|"PhysicalAttack"|"VoltAttack"|"Resist"|"FlameResist"|"FrostResist"|"PhysicalResist"|"VoltResist"|"Crit"|"HP"|"FlameAttackPercent"|"FrostAttackPercent"|"PhysicalAttackPercent"|"VoltAttackPercent"|"FlameResistPercent"|"FrostResistPercent"|"PhysicalResistPercent"|"VoltResistPercent"|"HPPercent"|"FlameDamagePercent"|"FrostDamagePercent"|"PhysicalDamagePercent"|"VoltDamagePercent"|"AlterAttack"|"AlterResist"|"AlterResistPercent"|"CritPercent"|"Delay"|"Heal"|"Skill"|"Discharge"|"Damage"|"Weak"|"Lifesteal"|"Recovery"|"Block"|"Reduction"|"Normal"|"Dodge"|"CritDamage";
export type stats = {
  [stat in statTypes]?:number
};