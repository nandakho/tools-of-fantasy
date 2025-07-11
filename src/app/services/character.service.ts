import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { GearsService, gearList, WeaponService, weaponList, StatsService, statTypes, MiscService, stats, weaponAvailable, weaponElement, basicElement } from '.';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public characterInfo: characterInfo;
  public characterStat = new StatsService();
  public charAvailable: characterAvailable[] = [];
  public charId:string = '';
  constructor(
    private gears: GearsService,
    private weapons: WeaponService,
    private misc: MiscService
  ) {
    this.characterInfo = this.initCharacterInfo();
    this.availChar();
  }

  initCharacterInfo(){
    return {
      uid: null,
      name: null,
      server: null,
      weapon: [
        {name:null,advance:0,level:0,matrix:{
          "Mind":{name:null,level:0,advance:0},
          "Memory":{name:null,level:0,advance:0},
          "Faith":{name:null,level:0,advance:0},
          "Emotion":{name:null,level:0,advance:0}}
        },
        {name:null,advance:0,level:0,matrix:{
          "Mind":{name:null,level:0,advance:0},
          "Memory":{name:null,level:0,advance:0},
          "Faith":{name:null,level:0,advance:0},
          "Emotion":{name:null,level:0,advance:0}}
        },
        {name:null,advance:0,level:0,matrix:{
          "Mind":{name:null,level:0,advance:0},
          "Memory":{name:null,level:0,advance:0},
          "Faith":{name:null,level:0,advance:0},
          "Emotion":{name:null,level:0,advance:0}}
        }
      ],
      gear: {
        "Bracers": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Legguards": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Sabatons": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Spaulders": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Armor": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Handguards": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Belt": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Helm": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        },
        "Exoskeleton": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        }, 
        "Microreactor": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        }, 
        "Eyepiece": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        }, 
        "Combat Engine": {
          rarity: null,
          random: [{type:null,val:0},{type:null,val:0},{type:null,val:0},{type:null,val:0}],
          augment: [{type:null,val:0},{type:null,val:0}],
          rare: {type:null,val:1},
          enhance: 0
        }
      },
      level: 1,
      supre: null,
      shots: {powerShot:0,sourceShot:0},
      simul: {"4500":0,"5500":0,"7000":0}
    }
  }

  charStat(booster?:boosterActive){
    let stat = new StatsService();
    if(this.characterInfo.shots.powerShot>0){
      for(let [ps,pv] of Object.entries(shotIncrease.powerShot)){
        stat.addVal(ps as statTypes,(pv*this.characterInfo.shots.powerShot));
      }
    }
    if(this.characterInfo.shots.sourceShot>0){
      for(let [ss,sv] of Object.entries(shotIncrease.sourceShot)){
        stat.addVal(ss as statTypes,(sv*this.characterInfo.shots.sourceShot));
      }
    }
    if(this.characterInfo.simul[4500]>0){
      for(let [s1s,s1v] of Object.entries(simulIncrease[4500])){
        stat.addVal(s1s as statTypes,(s1v*this.characterInfo.simul[4500]));
      }
    }
    if(this.characterInfo.simul[5500]>0){
      for(let [s2s,s2v] of Object.entries(simulIncrease[5500])){
        stat.addVal(s2s as statTypes,(s2v*this.characterInfo.simul[5500]));
      }
    }
    if(this.characterInfo.simul[7000]>0){
      for(let [s3s,s3v] of Object.entries(simulIncrease[7000])){
        stat.addVal(s3s as statTypes,(s3v*this.characterInfo.simul[7000]));
      }
    }
    if(this.characterInfo.supre!=null){
      for(let [sups,supv] of Object.entries(supreAvailable[this.characterInfo.supre])){
        stat.addVal(sups as statTypes,supv);
      }
    }
    //base stat
    stat.add({"Resist":150,"HP":24000,"Attack":300,"CritDamage":50});
    //blade shot
    if(booster?.bladeShot=="normal"){
      stat.add({"FlameAttackPercent":2.5,"FrostAttackPercent":2.5,"PhysicalAttackPercent":2.5,"VoltAttackPercent":2.5});
    }
    if(booster?.bladeShot=="enhanced"){
      stat.add({"FlameAttackPercent":3.5,"FrostAttackPercent":3.5,"PhysicalAttackPercent":3.5,"VoltAttackPercent":3.5});
    }
    //drinks
    if(booster?.drinks!=null){
      switch(booster.drinks){
        case "Flame":
          stat.add({"FlameAttackPercent":10});
          break;
        case "Flame_Nutripaste":
          stat.add({"FlameAttackPercent":12,"FlameAttackFlat":500});
          break;
        case "Frost":
          stat.add({"FrostAttackPercent":10});
          break;
        case "Frost_Nutripaste":
          stat.add({"FrostAttackPercent":12,"FrostAttackFlat":500});
          break;
        case "Physical":
          stat.add({"PhysicalAttackPercent":10});
          break;
        case "Physical_Nutripaste":
          stat.add({"PhysicalAttackPercent":12,"PhysicalAttackFlat":500});
          break;
        case "Volt":
          stat.add({"VoltAttackPercent":10});
          break;
        case "Volt_Nutripaste":
          stat.add({"VoltAttackPercent":12,"VoltAttackFlat":500});
          break;
      }
    }
    //sss - cosmic system
    if(this.characterInfo.sss!=undefined){
      const maxAtk = sssIncrease.Attack.length-1;
      const maxDmg = sssIncrease.Damage.length-1;
      for(let [ele,up] of Object.entries(this.characterInfo.sss)){
        switch(ele){
          case "Flame":
            if(up.Attack>0) stat.addVal("FlameAttack",sssIncrease.Attack[up.Attack>=maxAtk?maxAtk:up.Attack]);
            if(up.Damage>0) stat.addVal("FlameDamagePercent",sssIncrease.Damage[up.Damage>=maxDmg?maxDmg:up.Damage]);
            break;
          case "Frost":
            if(up.Attack>0) stat.addVal("FrostAttack",sssIncrease.Attack[up.Attack>=maxAtk?maxAtk:up.Attack]);
            if(up.Damage>0) stat.addVal("FrostDamagePercent",sssIncrease.Damage[up.Damage>=maxDmg?maxDmg:up.Damage]);
            break;
          case "Physical":
            if(up.Attack>0) stat.addVal("PhysicalAttack",sssIncrease.Attack[up.Attack>=maxAtk?maxAtk:up.Attack]);
            if(up.Damage>0) stat.addVal("PhysicalDamagePercent",sssIncrease.Damage[up.Damage>=maxDmg?maxDmg:up.Damage]);
            break;
          case "Volt":
            if(up.Attack>0) stat.addVal("VoltAttack",sssIncrease.Attack[up.Attack>=maxAtk?maxAtk:up.Attack]);
            if(up.Damage>0) stat.addVal("VoltDamagePercent",sssIncrease.Damage[up.Damage>=maxDmg?maxDmg:up.Damage]);
            break;
        }
      }
    }
    return stat.getAll();
  }

  async availChar(){
    const allChar = await Preferences.get({key:`availChar`});
    if(allChar.value) this.charAvailable = JSON.parse(allChar.value);
    this.charId = this.charAvailable.find(x=>x.selected==true)?.id??"";
    this.loadStat(this.charId);
  }

  async delChar(id:string){
    const idx = this.charAvailable.findIndex(x=>x.id==id);
    this.charAvailable.splice(idx,1);
    await Preferences.set({key:`availChar`,value:JSON.stringify(this.charAvailable)});
    await Preferences.remove({key:id});
    this.misc.showToast(`Character deleted!`);
    this.charId = this.charAvailable.length>0?this.charAvailable[0].id:"";
    await this.loadStat(this.charId);
  }

  async loadStat(id:string,jsonString:string|null=null){
    let idx = id;
    let valid = this.validateJson(jsonString??"null");
    if(jsonString!=null && !valid) this.misc.showToast(`Unrecognized file!`);
    if(jsonString!=null && valid){
      idx = this.generateTimestamp();
      await Preferences.set({key:`char_${idx}`,value:jsonString});
    }
    const c = await Preferences.get({key:`char_${idx}`});
    let info = JSON.parse(c.value??"null");
    for(let i=0; i<this.charAvailable.length; i++){
      this.charAvailable[i].selected = false;
    }
    if(jsonString!=null && valid){
      this.charAvailable.push({id:idx,name:info.name,uid:info.uid,selected:true});
    }
    this.charId = idx;
    const availIdx = this.charAvailable.findIndex(x=>x.id==idx);
    if(info!=null){
      this.charAvailable[availIdx].selected = true;
      this.characterInfo = info;
      await Preferences.set({key:`availChar`,value:JSON.stringify(this.charAvailable)});
    } else {
      this.characterInfo = this.initCharacterInfo();
    }
    this.charAvailable.sort((a,b)=>{
      if(a.name?.toLowerCase()==b.name?.toLowerCase()){
        if(a.uid==b.uid) return 0;
        if((a.uid??0)>(b.uid??0)) return 1;
        return -1
      }
      if((a.name?.toLowerCase()??"")>(b.name?.toLowerCase()??"")) return 1;
      return -1;
    });
    if(jsonString!=null && valid) this.misc.showToast(`Data loaded!`);
    this.calcStat();
  }
  
  generateTimestamp(){
    const d = new Date();
    return `${d.getFullYear().toString().padStart(4,"0")}${(d.getMonth()+1).toString().padStart(2,"0")}${d.getDate().toString().padStart(2,"0")}${d.getHours().toString().padStart(2,"0")}${d.getMinutes().toString().padStart(2,"0")}${d.getSeconds().toString().padStart(2,"0")}${d.getMilliseconds().toString().padStart(3,"0")}`;
  }

  validateJson(jsonString:string):boolean{
    let valid = true;
    try {
      const j = Object.keys(JSON.parse(jsonString));
      const keyNeeded = Object.keys(this.initCharacterInfo());
      for(let k of keyNeeded){
        if(!j.includes(k)){
          valid = false;
        }
      }
    } catch (e) {
      valid = false;
    }
    return valid;
  }

  async saveStat(id:string){
    let idx = id!=""?id:this.generateTimestamp();
    await Preferences.set({key:`char_${idx}`,value:JSON.stringify(this.characterInfo)});
    for(let i=0;i<this.charAvailable.length; i++){
      this.charAvailable[i].selected=false;
    }
    const availIdx = this.charAvailable.findIndex(x=>x.id==idx);
    if(availIdx>=0){
      this.charAvailable[availIdx] = {
        id: idx,
        name: this.characterInfo.name,
        uid: this.characterInfo.uid,
        selected: true
      }
    } else {
      this.charAvailable.push({id:idx,name:this.characterInfo.name,uid:this.characterInfo.uid,selected:true});
    }
    this.charId = idx;
    this.charAvailable.sort((a,b)=>{
      if(a.name?.toLowerCase()==b.name?.toLowerCase()){
        if(a.uid==b.uid) return 0;
        if((a.uid??0)>(b.uid??0)) return 1;
        return -1
      }
      if((a.name?.toLowerCase()??"")>(b.name?.toLowerCase()??"")) return 1;
      return -1;
    });
    await Preferences.set({key:`availChar`,value:JSON.stringify(this.charAvailable)});
    this.calcStat();
  }

  calcStat(){
    this.characterStat.initAll();
    const statGears = this.gears.calc(this.characterInfo.gear);
    const statChar = this.charStat(this.characterInfo.booster);
    const statWeap = this.weapons.calc(this.characterInfo.weapon,(this.characterInfo.booster?.enhancementShot??false));
    this.characterStat.add(statGears);
    this.characterStat.add(statChar);
    this.characterStat.add(statWeap);
    if(this.characterInfo.trait!=undefined){
      this.characterStat.add(this.traitCalc(this.characterInfo.trait));
    }
  }

  traitCalc(trait:string){
    const triggerTimes = (condition:traitCondition) => {
      let ok = 0;
      switch(condition.Trigger){
        case "Each":
          switch(condition.On){
            case "Element":
              for(let wpname of this.characterInfo.weapon){
                if(wpname.name!=null){
                  if(weaponAvailable[wpname.name].Element.includes(condition.What as weaponElement)) ok++;
                }
              }
            break;
          }
        break;
      }
      return ok;
    }
    let stat = new StatsService();
    const hasSpecialTrait = Object.keys(traitAvailable).includes(trait);
    if(hasSpecialTrait){
      const t = traitAvailable[trait];
      const n = triggerTimes(t.Condition);
      if(n>0){
        for(let s of t.Increase){
          stat.addVal(s as statTypes,(t.Value*n));
        }
      }
    }
    return stat.getAll();
  }

  //Calculate damage, for certain multiplier
  //temporary formula
  calcDamage(stat:stats, level:number, mult:number=1){
    const calc = (atkFinal:number,eleDamage:number,multiplier:number) => {
      let cr = (this.calcCrit(stat.Crit??0,"percent",level)+(stat.CritPercent??0));
      cr = cr>100?100:cr<0?0:cr;
      let cdmgmult = (1+(((stat.CritDamage??0)/100)*(cr/100)));
      return atkFinal*(1+(eleDamage/100))*multiplier*cdmgmult;
    }
    const calcAtk = (baseAtk:number,eleAtk:number,atkPercent:number) => {
      return (baseAtk+eleAtk)*(1+(atkPercent/100));
    }
    let atkFinal = {
      flame:calcAtk(stat.Attack??0,stat.FlameAttack??0,stat.FlameAttackPercent??0),
      frost:calcAtk(stat.Attack??0,stat.FrostAttack??0,stat.FrostAttackPercent??0),
      physical:calcAtk(stat.Attack??0,stat.PhysicalAttack??0,stat.PhysicalAttackPercent??0),
      volt:calcAtk(stat.Attack??0,stat.VoltAttack??0,stat.VoltAttackPercent??0),
      altered:0,
    }
    atkFinal.altered = [atkFinal.flame,atkFinal.frost,atkFinal.physical,atkFinal.volt].sort((a,b)=>b-a)[0]+(stat.AlterAttack??0);
    let dam = {
      flame:calc(atkFinal.flame,stat.FlameDamagePercent??0,mult),
      frost:calc(atkFinal.frost,stat.FrostDamagePercent??0,mult),
      physical:calc(atkFinal.physical,stat.PhysicalDamagePercent??0,mult),
      volt:calc(atkFinal.volt,stat.VoltDamagePercent??0,mult),
      altered:calc(atkFinal.altered,stat.AlterDamagePercent??0,mult)
    };
    return dam;
  }

  //Crit Calc
  calcCrit(crit:number, targetType:"base"|"percent", level:number):number {
    const crVal = crit?crit:0;
    const lvVal = level?level:0;
    const constant = this.getConstant(lvVal);
    const multA = (constant.a * (lvVal * lvVal));
    const multB = (constant.b * lvVal);
    const multC = (constant.c);
    const multSum = (multA + multB + multC);
    var res = 0;
    switch(targetType){
      case "base":
        res = Math.round((crVal * multSum)/100);
        break;
      case "percent":
        if(multSum){
          res = Math.ceil((crVal / multSum)*100000)/1000;
        }
        break;
    }
    return res<0?0:res;
  }

  /**
   * This constant value is datamined from Global Client version 3.1  
   * May or may not be accurate when version update come
   */
  getConstant(level:number):critConstant {
    if(level<=9){
      return {
        a: 0,
        b: 150,
        c: 0
      }
    }
    if(level<=40){
      return {
        a: -4,
        b: 408,
        c: -2078
      }
    }
    if(level<=80){
      return {
        a: -0.163,
        b: 285,
        c: -3215
      }
    }
    return {
      a: -3.71,
      b: 1151,
      c: -49787
    };
  }

  set bladeShot(bladeShot:"enhanced"|"normal"|null){
    this.characterInfo = Object.assign(this.characterInfo,{booster:{bladeShot,enhancementShot:this.enhancementShot,drinks:this.drinks}});
  }
  get bladeShot(){
    return this.characterInfo.booster?.bladeShot ?? null;
  }

  set enhancementShot(enhancementShot:boolean){
    this.characterInfo = Object.assign(this.characterInfo,{booster:{bladeShot:this.bladeShot,enhancementShot,drinks:this.drinks}});
  }
  get enhancementShot(){
    return this.characterInfo.booster?.enhancementShot ?? false;
  }

  set drinks(drinks:foodBuffs){
    this.characterInfo = Object.assign(this.characterInfo,{booster:{bladeShot:this.bladeShot,enhancementShot:this.enhancementShot,drinks}});
  }
  get drinks(){
    return this.characterInfo.booster?.drinks ?? null;
  }
  
  set sssFlameAttack(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:stat,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssFlameAttack():number {
    return this.characterInfo.sss?.Flame?.Attack ?? 0;
  }
  set sssFlameDamage(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:stat},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssFlameDamage():number {
    return this.characterInfo.sss?.Flame?.Damage ?? 0;
  }

  set sssFrostAttack(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:stat,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssFrostAttack():number {
    return this.characterInfo.sss?.Frost?.Attack ?? 0;
  }
  set sssFrostDamage(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:stat},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssFrostDamage():number {
    return this.characterInfo.sss?.Frost?.Damage ?? 0;
  }
  
  set sssPhysicalAttack(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:stat,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssPhysicalAttack():number {
    return this.characterInfo.sss?.Physical?.Attack ?? 0;
  }
  set sssPhysicalDamage(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:stat},Volt:{Attack:this.sssVoltAttack,Damage:this.sssVoltDamage}}});
  }
  get sssPhysicalDamage():number {
    return this.characterInfo.sss?.Physical?.Damage ?? 0;
  }
  
  set sssVoltAttack(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:stat,Damage:this.sssVoltDamage}}});
  }
  get sssVoltAttack():number {
    return this.characterInfo.sss?.Volt?.Attack ?? 0;
  }
  set sssVoltDamage(stat:number){
    this.characterInfo = Object.assign(this.characterInfo,{sss:{Flame:{Attack:this.sssFlameAttack,Damage:this.sssFlameDamage},Frost:{Attack:this.sssFrostAttack,Damage:this.sssFrostDamage},Physical:{Attack:this.sssPhysicalAttack,Damage:this.sssPhysicalDamage},Volt:{Attack:this.sssVoltAttack,Damage:stat}}});
  }
  get sssVoltDamage():number {
    return this.characterInfo.sss?.Volt?.Damage ?? 0;
  }
}

export const shotIncrease = {
  powerShot:{"Attack":25.0},
  sourceShot:{"HP":1200.0}
}
type shotTaken = {
  powerShot: number;
  sourceShot: number;
}
type boosterActive = {
  bladeShot: "enhanced"|"normal"|null;
  enhancementShot: boolean;
  drinks: foodBuffs;
}
type sssStat = {
  Attack:number;
  Damage:number
}
type sssAllStat = {
  [element in basicElement]:sssStat;
};
export type sssAvailable = {
  element: basicElement,
  type: string[];
}
export const sssIncrease = {
  Attack: [0,150,300,450,600,750],
  Damage: [0,0.5,1,1.5,2,2.5]
}
export type foodBuffs = "Flame"|"Flame_Nutripaste"|"Frost"|"Frost_Nutripaste"|"Physical"|"Physical_Nutripaste"|"Volt"|"Volt_Nutripaste"|null;
export const simulIncrease = {
  "4500":{"HP":7600.0},
  "5500":{"Attack":25.0,"HP":2000.0},
  "7000":{"Attack":55.0}
}
type simulActive = {
  "4500": number;
  "5500": number;
  "7000": number;
}
export type serverList = "Asia Pacific"|"Europe"|"North America"|"South America"|"Southeast Asia";
export interface characterInfo {
  uid: string|null;
  name: string|null;
  server: serverList|null;
  weapon: weaponList[];
  gear: gearList;
  level: number;
  supre: string|null;
  shots: shotTaken;
  booster?: boosterActive;
  simul: simulActive;
  trait?: string;
  sss?: sssAllStat;
}
type supreStat = {
  [name:string]:{
    [stat:string]:number;
  }
}
type traitStat = {
  [name:string]:{
    Increase:string;
    Value:number;
    Condition:traitCondition;
  }
}
type traitCondition = {
  Trigger: string;
  On: string;
  What: string;
}
export const supreAvailable:supreStat = require("./tables/supreStat.json");
export const traitAvailable:traitStat = require("./tables/traitStat.json");

interface critConstant {
  a: number,
  b: number,
  c: number
}

interface characterAvailable {
  id: string,
  name: string|null,
  uid: string|null,
  selected: boolean
}