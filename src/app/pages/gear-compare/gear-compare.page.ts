import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AlertInput, NavController } from '@ionic/angular';
import { MiscService, augStat, basicStat, statTypes, gear, gearTypes, CharacterService, characterInfo, randomStatList, augStatList, titanStatList, augAvailable, StatsService, GearsService, gearList } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';
import { Chart } from 'chart.js/auto';
import { getMetadata } from 'meta-png';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage {
  @ViewChild('graphcanvas') editCanvas:any;
  chart: any;
  rs = randomStatList;
  as = augStatList;
  ts = titanStatList;
  al = augAvailable;
  url: string|null = '';
  elementSelected:elementAvailable = "Flame";
  elementAvailable:elementAvailable[] = ["Flame","Frost","Physical","Volt","Altered"];
  gearSelected: gear = {
    type: "Helm",
    rarity: "5"
  };
  gearAvailable: gearTypes[] = ["Helm","Armor","Belt","Legguards","Bracers","Spaulders","Sabatons","Handguards","Eyepiece","Combat Engine","Exoskeleton","Microreactor"];
  sharedStats:basicStat = {
    baseAtk: 0,
    enhanceAtk: 0,
    bonusAtk: 0
  }
  yourStats:pStats = {
    baseAtk: 0,
    bonusAtk: 0
  }
  equipment: eqStats[] = [];
  equipped: number|undefined = undefined;
  helpGif: any = undefined;
  typeSelected: string = "Manual";
  changedOnly: boolean = true;
  changedStats: any[] = [];
  compareStats: any[] = [];
  selectedChar: any = "";
  curChar: characterInfo = this.char.initCharacterInfo();
  gearsCompare: any[] = [];
  curStat = new StatsService();
  eqOrder: gearTypes[] = ["Helm","Eyepiece","Spaulders","Handguards","Bracers","Armor","Combat Engine","Belt","Legguards","Sabatons","Exoskeleton","Microreactor"];
  multiType: boolean = true;
  singleType: gearTypes = "Helm";
  graphInitDone: boolean = false;
  baseDam: any = null;
  tempAddStat: number|undefined = undefined;
  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private alert: AlertController,
    private misc: MiscService,
    public char: CharacterService,
    private nav: NavController,
    private gears: GearsService
  ) {
    this.serverSide();
  }

  async loadImage(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (_) => { 
      const fr = new FileReader();
      const item = await input.files?.item(0);
      if(item!=null){
        fr.readAsArrayBuffer(item);
        fr.onload = async (e) =>{
          const loaded = e?.target?.result;
          if(loaded!=null){
            try {
              const dataArray = new Uint8Array(loaded as ArrayBuffer);
              const metadata = getMetadata(dataArray,"tof.nandakho.my.id");
              if(metadata){
                const decoded = this.misc.decodeString(metadata);
                if(this.char.validateJson(decoded)){
                  this.curChar = JSON.parse(decoded);
                  this.recalcStat();
                  this.misc.showToast('Equipment loaded');
                } else {
                  this.misc.showToast('Invalid metadata');
                }
              } else {
                this.misc.showToast('Metadata not found!');
              }
            } catch (err) {
              this.misc.showToast('Unrecognized file!');
            }
          }
        }
      }
    }
    input.click();
  }

  addStat(compareId:number|null,eqType:gearTypes,statType:"random"|"augment",index:number,tempVal:number|undefined){
    let addVal = tempVal??0;
    if(compareId==null){
      this.curChar.gear[eqType][statType][index].val+=addVal;
      this.recalcStat();
    } else {
      this.gearsCompare.find(x=>x.id==compareId)[statType][index].val+=addVal;
      this.recalcCompareStat();
    }
  }

  recalcStat(){
    this.changedStats = [];
    this.curStat.initAll();
    this.curStat.add(this.char.characterStat.getAll());
    let oldGear = new StatsService();
    oldGear.add(this.gears.calc(this.char.characterInfo.gear));
    this.curStat.sub(oldGear.getAll());
    this.curStat.add(this.gears.calc(this.curChar.gear));
    if(this.hp!=this.hpOld){
      this.changedStats.push({iconname:'HP',name:'HP',val:this.hp,increase:this.hp-this.hpOld});
    }
    if(this.crit!=this.critOld){
      this.changedStats.push({iconname:'Crit',name:'Crit',val:this.crit,increase:this.crit-this.critOld});
    }
    if(this.critPercent!=this.critPercentOld){
      this.changedStats.push({iconname:'CritPercent',name:'Crit Rate',val:`${this.critPercent}%`,increase:this.critPercent-this.critPercentOld});
    }
    if(this.physicalAtk!=this.physicalAtkOld){
      this.changedStats.push({iconname:'PhysicalAttack',name:'Physical Attack',val:this.physicalAtk,increase:this.physicalAtk-this.physicalAtkOld});
    }
    if(this.physicalDam!=this.physicalDamOld){
      this.changedStats.push({iconname:'PhysicalDamagePercent',name:'Physical Damage',val:`${this.physicalDam}%`,increase:this.physicalDam-this.physicalDamOld});
    }
    if(this.flameAtk!=this.flameAtkOld){
      this.changedStats.push({iconname:'FlameAttack',name:'Flame Attack',val:this.flameAtk,increase:this.flameAtk-this.flameAtkOld});
    }
    if(this.flameDam!=this.flameDamOld){
      this.changedStats.push({iconname:'FlameDamagePercent',name:'Flame Damage',val:`${this.flameDam}%`,increase:this.flameDam-this.flameDamOld});
    }
    if(this.frostAtk!=this.frostAtkOld){
      this.changedStats.push({iconname:'FrostAttack',name:'Frost Attack',val:this.frostAtk,increase:this.frostAtk-this.frostAtkOld});
    }
    if(this.frostDam!=this.frostDamOld){
      this.changedStats.push({iconname:'FrostDamagePercent',name:'Frost Damage',val:`${this.frostDam}%`,increase:this.frostDam-this.frostDamOld});
    }
    if(this.voltAtk!=this.voltAtkOld){
      this.changedStats.push({iconname:'VoltAttack',name:'Volt Attack',val:this.voltAtk,increase:this.voltAtk-this.voltAtkOld});
    }
    if(this.voltDam!=this.voltDamOld){
      this.changedStats.push({iconname:'VoltDamagePercent',name:'Volt Damage',val:`${this.voltDam}%`,increase:this.voltDam-this.voltDamOld});
    }
    if(this.alterAtk!=this.alterAtkOld){
      this.changedStats.push({iconname:'AlterAttack',name:'Altered Attack',val:this.alterAtk,increase:this.alterAtk-this.alterAtkOld});
    }
    if(this.physicalRes!=this.physicalResOld){
      this.changedStats.push({iconname:'PhysicalResist',name:'Physical Resistance',val:this.physicalRes,increase:this.physicalRes-this.physicalResOld});
    }
    if(this.flameRes!=this.flameResOld){
      this.changedStats.push({iconname:'FlameResist',name:'Flame Resistance',val:this.flameRes,increase:this.frostRes-this.frostResOld});
    }
    if(this.frostRes!=this.frostResOld){
      this.changedStats.push({iconname:'FrostResist',name:'Frost Resistance',val:this.frostRes,increase:this.frostRes-this.frostResOld});
    }
    if(this.voltRes!=this.voltResOld){
      this.changedStats.push({iconname:'VoltResist',name:'Volt Resistance',val:this.voltRes,increase:this.voltRes-this.voltResOld});
    }
    if(this.alterRes!=this.alterResOld){
      this.changedStats.push({iconname:'AlterResist',name:'Altered Resistance',val:this.alterRes,increase:this.alterRes-this.alterResOld});
    }
    if(this.titanBlock!=this.titanBlockOld){
      this.changedStats.push({iconname:'Block',name:'Block',val:this.titanBlock,increase:this.titanBlock-this.titanBlockOld});
    }
    if(this.titanWeak!=this.titanWeakOld){
      this.changedStats.push({iconname:'Weak',name:'Weak Point Damage Boost',val:this.titanWeak,increase:this.titanWeak-this.titanWeakOld});
    }
    if(this.titanLifesteal!=this.titanLifestealOld){
      this.changedStats.push({iconname:'Lifesteal',name:'Lifesteal',val:this.titanLifesteal,increase:this.titanLifesteal-this.titanLifestealOld});
    }
    if(this.titanRecovery!=this.titanRecoveryOld){
      this.changedStats.push({iconname:'Recovery',name:'HP Recovery',val:this.titanRecovery,increase:this.titanRecovery-this.titanRecoveryOld});
    }
    if(this.titanDelay!=this.titanDelayOld){
      this.changedStats.push({iconname:'Delay',name:'Delay',val:this.titanDelay,increase:this.titanDelay-this.titanDelayOld});
    }
    if(this.titanNormal!=this.titanNormalOld){
      this.changedStats.push({iconname:'Normal',name:'Normal Attack Damage Boost',val:this.titanNormal,increase:this.titanNormal-this.titanNormalOld});
    }
    if(this.titanDodge!=this.titanDodgeOld){
      this.changedStats.push({iconname:'Dodge',name:'Dodge Attack Damage Boost',val:this.titanDodge,increase:this.titanDodge-this.titanDodgeOld});
    }
    if(this.titanSkill!=this.titanSkillOld){
      this.changedStats.push({iconname:'Skill',name:'Skill Damage Boost',val:this.titanSkill,increase:this.titanSkill-this.titanSkillOld});
    }
    if(this.titanDischarge!=this.titanDischargeOld){
      this.changedStats.push({iconname:'Discharge',name:'Discharge Damage Boost',val:this.titanDischarge,increase:this.titanDischarge-this.titanDischargeOld});
    }
    if(this.titanDamage!=this.titanDamageOld){
      this.changedStats.push({iconname:'Damage',name:'Damage Boost',val:this.titanDamage,increase:this.titanDamage-this.titanDamageOld});
    }
    if(this.titanReduction!=this.titanReductionOld){
      this.changedStats.push({iconname:'Reduction',name:'Damage Reduction',val:this.titanReduction,increase:this.titanReduction-this.titanReductionOld});
    }
    if(this.titanHeal!=this.titanHealOld){
      this.changedStats.push({iconname:'Heal',name:'Increased Healing',val:this.titanHeal,increase:this.titanHeal-this.titanHealOld});
    }
    this.graphRefresh();
  }

  recalcCompareStat(){
    let addPct = ["PhysicalDamagePercent","FlameDamagePercent","FrostDamagePercent","VoltDamagePercent","CritPercent"];
    this.compareStats = [];
    let cs = new StatsService();
    cs.add(this.char.characterStat.getAll());
    const statsOld = {
      HP: Math.round(cs.getVal("HP")*(1+(cs.getVal("HPPercent")/100))),
      Crit: Math.floor(cs.getVal("Crit")),
      CritPercent: cs.getVal("CritPercent"),
      PhysicalAttack: Math.round(Math.round((cs.getVal("PhysicalAttack")+cs.getVal("Attack")))*(1+(cs.getVal("PhysicalAttackPercent")/100))),
      PhysicalDamagePercent: Math.round(cs.getVal("PhysicalDamagePercent")*100)/100,
      FlameAttack: Math.round(Math.round((cs.getVal("FlameAttack")+cs.getVal("Attack")))*(1+(cs.getVal("FlameAttackPercent")/100))),
      FlameDamagePercent: Math.round(cs.getVal("FlameDamagePercent")*100)/100,
      FrostAttack: Math.round(Math.round((cs.getVal("FrostAttack")+cs.getVal("Attack")))*(1+(cs.getVal("FrostAttackPercent")/100))),
      FrostDamagePercent: Math.round(cs.getVal("FrostDamagePercent")*100)/100,
      VoltAttack: Math.round(Math.round((cs.getVal("VoltAttack")+cs.getVal("Attack")))*(1+(cs.getVal("VoltAttackPercent")/100))),
      VoltDamagePercent: Math.round(cs.getVal("VoltDamagePercent")*100)/100,
      AlterAttack: Math.floor([
        Math.round(Math.round((cs.getVal("PhysicalAttack")+cs.getVal("Attack")))*(1+(cs.getVal("PhysicalAttackPercent")/100))),
        Math.round(Math.round((cs.getVal("FlameAttack")+cs.getVal("Attack")))*(1+(cs.getVal("FlameAttackPercent")/100))),
        Math.round(Math.round((cs.getVal("FrostAttack")+cs.getVal("Attack")))*(1+(cs.getVal("FrostAttackPercent")/100))),
        Math.round(Math.round((cs.getVal("VoltAttack")+cs.getVal("Attack")))*(1+(cs.getVal("VoltAttackPercent")/100)))
      ].sort((a,b)=>b-a)[0]+cs.getVal("AlterAttack")),
      PhysicalResist: Math.floor((cs.getVal("PhysicalResist")+cs.getVal("Resist"))*(1+(cs.getVal("PhysicalResistPercent")/100))),
      FlameResist: Math.floor((cs.getVal("FlameResist")+cs.getVal("Resist"))*(1+(cs.getVal("FlameResistPercent")/100))),
      FrostResist: Math.floor((cs.getVal("FrostResist")+cs.getVal("Resist"))*(1+(cs.getVal("FrostResistPercent")/100))),
      VoltResist: Math.floor((cs.getVal("VoltResist")+cs.getVal("Resist"))*(1+(cs.getVal("VoltResistPercent")/100))),
      AlterResist: Math.floor((cs.getVal("AlterResist")+cs.getVal("Resist"))*(1+(cs.getVal("AlterResistPercent")/100))),
      Block: cs.getVal("Block"),
      Weak: cs.getVal("Weak"),
      Lifesteal: cs.getVal("Lifesteal"),
      Recovery: cs.getVal("Recovery"),
      Delay: cs.getVal("Delay"),
      Normal: cs.getVal("Normal"),
      Dodge: cs.getVal("Dodge"),
      Skill: cs.getVal("Skill"),
      Discharge: cs.getVal("Discharge"),
      Damage: cs.getVal("Damage"),
      Reduction: cs.getVal("Reduction"),
      Heal: cs.getVal("Heal")
    }
    for(let x of this.gearsCompare){
      x.compareStats = [];
      let xcs = new StatsService();
      xcs.initAll();
      xcs.add(this.char.characterStat.getAll());
      xcs.sub(this.gears.calc(this.char.characterInfo.gear));
      let newGearset:gearList = JSON.parse(JSON.stringify(this.char.characterInfo.gear));
      newGearset[this.singleType] = {
        enhance: x.enhance,
        rarity: x.rarity,
        augment: x.augment,
        random: x.random,
        rare: x.rare
      }
      xcs.add(this.gears.calc(newGearset));
      const statsNew = {
        HP: Math.round(xcs.getVal("HP")*(1+(xcs.getVal("HPPercent")/100))),
        Crit: Math.floor(xcs.getVal("Crit")),
        CritPercent: xcs.getVal("CritPercent"),
        PhysicalAttack: Math.round(Math.round((xcs.getVal("PhysicalAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("PhysicalAttackPercent")/100))),
        PhysicalDamagePercent: Math.round(xcs.getVal("PhysicalDamagePercent")*100)/100,
        FlameAttack: Math.round(Math.round((xcs.getVal("FlameAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("FlameAttackPercent")/100))),
        FlameDamagePercent: Math.round(xcs.getVal("FlameDamagePercent")*100)/100,
        FrostAttack: Math.round(Math.round((xcs.getVal("FrostAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("FrostAttackPercent")/100))),
        FrostDamagePercent: Math.round(xcs.getVal("FrostDamagePercent")*100)/100,
        VoltAttack: Math.round(Math.round((xcs.getVal("VoltAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("VoltAttackPercent")/100))),
        VoltDamagePercent: Math.round(xcs.getVal("VoltDamagePercent")*100)/100,
        AlterAttack: Math.floor([
          Math.round(Math.round((xcs.getVal("PhysicalAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("PhysicalAttackPercent")/100))),
          Math.round(Math.round((xcs.getVal("FlameAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("FlameAttackPercent")/100))),
          Math.round(Math.round((xcs.getVal("FrostAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("FrostAttackPercent")/100))),
          Math.round(Math.round((xcs.getVal("VoltAttack")+xcs.getVal("Attack")))*(1+(xcs.getVal("VoltAttackPercent")/100)))
        ].sort((a,b)=>b-a)[0]+xcs.getVal("AlterAttack")),
        PhysicalResist: Math.floor((xcs.getVal("PhysicalResist")+xcs.getVal("Resist"))*(1+(xcs.getVal("PhysicalResistPercent")/100))),
        FlameResist: Math.floor((xcs.getVal("FlameResist")+xcs.getVal("Resist"))*(1+(xcs.getVal("FlameResistPercent")/100))),
        FrostResist: Math.floor((xcs.getVal("FrostResist")+xcs.getVal("Resist"))*(1+(xcs.getVal("FrostResistPercent")/100))),
        VoltResist: Math.floor((xcs.getVal("VoltResist")+xcs.getVal("Resist"))*(1+(xcs.getVal("VoltResistPercent")/100))),
        AlterResist: Math.floor((xcs.getVal("AlterResist")+xcs.getVal("Resist"))*(1+(xcs.getVal("AlterResistPercent")/100))),
        Block: xcs.getVal("Block"),
        Weak: xcs.getVal("Weak"),
        Lifesteal: xcs.getVal("Lifesteal"),
        Recovery: xcs.getVal("Recovery"),
        Delay: xcs.getVal("Delay"),
        Normal: xcs.getVal("Normal"),
        Dodge: xcs.getVal("Dodge"),
        Skill: xcs.getVal("Skill"),
        Discharge: xcs.getVal("Discharge"),
        Damage: xcs.getVal("Damage"),
        Reduction: xcs.getVal("Reduction"),
        Heal: xcs.getVal("Heal")
      }
      if(statsOld.HP!=statsNew.HP) x.compareStats.push({iconname:'HP',name:'HP',val:statsNew.HP,increase:statsNew.HP-statsOld.HP});
      if(statsOld.Crit!=statsNew.Crit) x.compareStats.push({iconname:'Crit',name:'Crit',val:statsNew.Crit,increase:statsNew.Crit-statsOld.Crit});
      if(statsOld.CritPercent!=statsNew.CritPercent) x.compareStats.push({iconname:'CritPercent',name:'Crit Rate',val:`${statsNew.CritPercent}%`,increase:statsNew.CritPercent-statsOld.CritPercent});
      if(statsOld.PhysicalAttack!=statsNew.PhysicalAttack) x.compareStats.push({iconname:'PhysicalAttack',name:'Physical Attack',val:statsNew.PhysicalAttack,increase:statsNew.PhysicalAttack-statsOld.PhysicalAttack});
      if(statsOld.FlameAttack!=statsNew.FlameAttack) x.compareStats.push({iconname:'FlameAttack',name:'Flame Attack',val:statsNew.FlameAttack,increase:statsNew.FlameAttack-statsOld.FlameAttack});
      if(statsOld.FrostAttack!=statsNew.FrostAttack) x.compareStats.push({iconname:'FrostAttack',name:'Frost Attack',val:statsNew.FrostAttack,increase:statsNew.FrostAttack-statsOld.FrostAttack});
      if(statsOld.VoltAttack!=statsNew.VoltAttack) x.compareStats.push({iconname:'VoltAttack',name:'Volt Attack',val:statsNew.VoltAttack,increase:statsNew.VoltAttack-statsOld.VoltAttack});
      if(statsOld.AlterAttack!=statsNew.AlterAttack) x.compareStats.push({iconname:'AlterAttack',name:'Altered Attack',val:statsNew.AlterAttack,increase:statsNew.AlterAttack-statsOld.AlterAttack});
      if(statsOld.PhysicalDamagePercent!=statsNew.PhysicalDamagePercent) x.compareStats.push({iconname:'PhysicalDamagePercent',name:'Physical Damage',val:`${statsNew.PhysicalDamagePercent}%`,increase:statsNew.PhysicalDamagePercent-statsOld.PhysicalDamagePercent});
      if(statsOld.FlameDamagePercent!=statsNew.FlameDamagePercent) x.compareStats.push({iconname:'FlameDamagePercent',name:'Flame Damage',val:`${statsNew.FlameDamagePercent}%`,increase:statsNew.FlameDamagePercent-statsOld.FlameDamagePercent});
      if(statsOld.FrostDamagePercent!=statsNew.FrostDamagePercent) x.compareStats.push({iconname:'FrostDamagePercent',name:'Frost Damage',val:`${statsNew.FrostDamagePercent}%`,increase:statsNew.FrostDamagePercent-statsOld.FrostDamagePercent});
      if(statsOld.VoltDamagePercent!=statsNew.VoltDamagePercent) x.compareStats.push({iconname:'VoltDamagePercent',name:'Volt Damage',val:`${statsNew.VoltDamagePercent}%`,increase:statsNew.VoltDamagePercent-statsOld.VoltDamagePercent});
      if(statsOld.PhysicalResist!=statsNew.PhysicalResist) x.compareStats.push({iconname:'PhysicalResist',name:'Physical Resistance',val:statsNew.PhysicalResist,increase:statsNew.PhysicalResist-statsOld.PhysicalResist});
      if(statsOld.FlameResist!=statsNew.FlameResist) x.compareStats.push({iconname:'FlameResist',name:'Flame Resistance',val:statsNew.FlameResist,increase:statsNew.FlameResist-statsOld.FlameResist});
      if(statsOld.FrostResist!=statsNew.FrostResist) x.compareStats.push({iconname:'FrostResist',name:'Frost Resistance',val:statsNew.FrostResist,increase:statsNew.FrostResist-statsOld.FrostResist});
      if(statsOld.VoltResist!=statsNew.VoltResist) x.compareStats.push({iconname:'VoltResist',name:'Volt Resistance',val:statsNew.VoltResist,increase:statsNew.VoltResist-statsOld.VoltResist});
      if(statsOld.AlterResist!=statsNew.AlterResist) x.compareStats.push({iconname:'AlterResist',name:'Altered Resistance',val:statsNew.AlterResist,increase:statsNew.AlterResist-statsOld.AlterResist});
      if(statsOld.Block!=statsNew.Block) x.compareStats.push({iconname:'Block',name:'Block',val:statsNew.Block,increase:statsNew.Block-statsOld.Block});
      if(statsOld.Weak!=statsNew.Weak) x.compareStats.push({iconname:'Weak',name:'Weak Point Damage Boost',val:statsNew.Weak,increase:statsNew.Weak-statsOld.Weak});
      if(statsOld.Lifesteal!=statsNew.Lifesteal) x.compareStats.push({iconname:'Lifesteal',name:'Lifesteal',val:statsNew.Lifesteal,increase:statsNew.Lifesteal-statsOld.Lifesteal});
      if(statsOld.Recovery!=statsNew.Recovery) x.compareStats.push({iconname:'Recovery',name:'HP Recovery',val:statsNew.Recovery,increase:statsNew.Recovery-statsOld.Recovery});
      if(statsOld.Delay!=statsNew.Delay) x.compareStats.push({iconname:'Delay',name:'Delay',val:statsNew.Delay,increase:statsNew.Delay-statsOld.Delay});
      if(statsOld.Normal!=statsNew.Normal) x.compareStats.push({iconname:'Normal',name:'Normal Attack Damage Boost',val:statsNew.Normal,increase:statsNew.Normal-statsOld.Normal});
      if(statsOld.Dodge!=statsNew.Dodge) x.compareStats.push({iconname:'Dodge',name:'Dodge Attack Damage Boost',val:statsNew.Dodge,increase:statsNew.Dodge-statsOld.Dodge});
      if(statsOld.Skill!=statsNew.Skill) x.compareStats.push({iconname:'Skill',name:'Skill Damage Boost',val:statsNew.Skill,increase:statsNew.Skill-statsOld.Skill});
      if(statsOld.Discharge!=statsNew.Discharge) x.compareStats.push({iconname:'Discharge',name:'Discharge Damage Boost',val:statsNew.Discharge,increase:statsNew.Discharge-statsOld.Discharge});
      if(statsOld.Damage!=statsNew.Damage) x.compareStats.push({iconname:'Damage',name:'Damage Boost',val:statsNew.Damage,increase:statsNew.Damage-statsOld.Damage});
      if(statsOld.Reduction!=statsNew.Reduction) x.compareStats.push({iconname:'Reduction',name:'Damage Reduction',val:statsNew.Reduction,increase:statsNew.Reduction-statsOld.Reduction});
      if(statsOld.Heal!=statsNew.Heal) x.compareStats.push({iconname:'Heal',name:'Increased Healing',val:statsNew.Heal,increase:statsNew.Heal-statsOld.Heal});
      x.compareStats.map((y:any)=>{
        let v = statsOld as any;
        if(this.compareStats.findIndex(c=>c.iconname==y.iconname)==-1) this.compareStats.push({ iconname: y.iconname, name: y.name, val: addPct.includes(y.iconname)?`${v[y.iconname]}%`:v[y.iconname] });
      });
    }
    this.compareStats.sort((a,b)=>Object.keys(statsOld).indexOf(a.iconname)-Object.keys(statsOld).indexOf(b.iconname));
    this.graphRefresh();
  }

  percentageDamage(dam:{flame:number,frost:number,physical:number,volt:number,altered:number}){
    const avg = (cur:number,baseMax:number) => {
      return Math.floor((cur/baseMax)*10000)/100;
    }
    const x = JSON.parse(JSON.stringify(this.baseDam));
    let b = Object.values({
      flame: x.flame,
      frost: x.frost,
      physical: x.physical,
      volt: x.volt,
      altered: x.altered
    }).sort((a,b)=>b-a)[0];
    return {
      flame: avg(dam.flame,b),
      frost: avg(dam.frost,b),
      physical: avg(dam.physical,b),
      volt: avg(dam.volt,b),
      altered: avg(dam.altered,b)
    };
  }  

  randomColor(){
    return {r:Math.floor(Math.random()*255),g:Math.floor(Math.random()*255),b:Math.floor(Math.random()*255)};
  }

  graphInit(){
    if(this.char.charAvailable.length==0) return;
    var canvasElement = this.editCanvas.nativeElement;
    let ctx = canvasElement.getContext('2d');
    this.baseDam = this.char.calcDamage(this.char.characterStat.getAll());
    let d = this.percentageDamage(this.baseDam);
    this.chart = new Chart(ctx,{
      type: 'bar',
      data: {
        labels: ['Flame','Frost','Physical','Volt','Altered'],
        datasets: [{
          label: 'Current',
          data: [d.flame,d.frost,d.physical,d.volt,d.altered],
          borderColor: `rgb(0,128,214)`,
          backgroundColor: `rgb(0,128,214)`
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color(z){
                return ['rgb(255, 99, 132)','rgb(114, 222, 235)','rgb(255, 159, 64)','rgb(192, 134, 235)','rgb(54, 255, 132)'][z.index];
              }
            },
            grid: {
              color: "rgba(255,255,255,0.1)"
            }
          },
          y: {
            ticks: {
              color: '#f4f5f8'
            },
            grid: {
              color: "rgba(255,255,255,0.1)"
            }
          }
        },
        color: `#f4f5f8`,
        plugins: {
          tooltip: {
            callbacks: {
              label(x){
                return `${x.dataset.label}: ${x.formattedValue}%`;
              }
            }
          }
        }
      }
    });
    this.graphInitDone = true;
  }

  graphRefresh(){
    if(this.char.charAvailable.length==0) return;
    if(!this.graphInitDone) this.graphInit();
    this.chart.data.datasets = [this.chart.data.datasets[0]];
    if(this.multiType){
      let d = this.percentageDamage(this.char.calcDamage(this.curStat.getAll()));
      let c = this.randomColor();
      this.chart.data.datasets.push({
        label: 'New',
        data: [d.flame,d.frost,d.physical,d.volt,d.altered],
        borderColor: `rgb(${c.r},${c.g},${c.b})`,
        backgroundColor: `rgb(${c.r},${c.g},${c.b})`
      });
    } else {
      //to be added
      let ind=0;
      for(let x of this.gearsCompare){
        ind++;
        let xcs = new StatsService();
        xcs.initAll();
        xcs.add(this.char.characterStat.getAll());
        xcs.sub(this.gears.calc(this.char.characterInfo.gear));
        let ngs:gearList = JSON.parse(JSON.stringify(this.char.characterInfo.gear));
        ngs[this.singleType] = {
          enhance: x.enhance,
          rarity: x.rarity,
          augment: x.augment,
          random: x.random,
          rare: x.rare
        }
        xcs.add(this.gears.calc(ngs));
        let d = this.percentageDamage(this.char.calcDamage(xcs.getAll()));
        let c = this.randomColor();
        this.chart.data.datasets.push({
          label: `New ${ind}`,
          data: [d.flame,d.frost,d.physical,d.volt,d.altered],
          borderColor: `rgb(${c.r},${c.g},${c.b})`,
          backgroundColor: `rgb(${c.r},${c.g},${c.b})`
        });
      }
    }
    this.chart.update();
  }

  validLength(length:number): boolean {
    length-=11;
    return length<0?false:length%3==0;
  }

  parseEq(data:string[], many:number): void {
    for (let i = 0; i < many; i++) {
      this.addEquipment(parseFloat(data[8+(3*i)]),parseFloat(data[9+(3*i)]),parseFloat(data[10+(3*i)]));
    }
  }

  serverSide(){
    this.url = this.route.snapshot.paramMap.get('attr');
    if(this.url){
      const attr = this.url.split("_");
      this.elementSelected = this.elementAvailable[(parseInt(attr?.[0])||0)<this.elementAvailable.length?(parseInt(attr?.[0])||0):0];
      this.gearSelected = {
        type: this.gearAvailable[(parseInt(attr?.[1])||0)<this.gearAvailable.length?(parseInt(attr?.[1])||0):0],
        rarity: "5"
      }
      if(this.validLength(attr?.length||0)){
        this.yourStats = {
          baseAtk: parseInt(attr[2])||0,
          bonusAtk: parseInt(attr[3])||0
        }
        this.sharedStats = {
          baseAtk: parseInt(attr[4])||0,
          enhanceAtk: parseInt(attr[5])||0,
          bonusAtk: parseInt(attr[6])||0
        }
        const many = (attr.length-9)/3;
        this.parseEq(attr, many);
        const eqpd = parseInt(attr[7]);
        this.equipped = Number.isNaN(eqpd)?undefined:eqpd<many?eqpd:undefined;
        this.recalcEquip("all");
      }
    }
    this.setTag();
  }

  setTag(){
    var desc = ``;
    const attr = this.url?.split("_");
    if(this.validLength(attr?.length||0)){
      const many = ((attr?.length??0)-9)/3;
      desc += `Check my gear!`;
      for (let i = 0; i < many; i++) {
        desc += `\nGear #${i+1}: Attack ${this.equipment[i].attack}, ${this.elementSelected} Attack ${this.equipment[i].eleAttack} + ${this.equipment[i].eleAttackPercent}%, Total Attack: ${this.equipment[i].calculated.total} (Gain ${this.equipment[i].calculated.gain})`;
      }
    } else {
      desc += `Let's find out which gear boost more of your attack!\nIs it the high flat attack one or the percent one?`;
    }
    this.title.setTitle(`Tools of Fantasy - Gear Compare`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: `/gear-compare${this.url?'/'+this.url:''}` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `Tools of Fantasy - Gear Compare` });
    this.meta.updateTag({ property: 'og:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: `Tools of Fantasy - Gear Compare` });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
  }

  eleRadioGenerate(){
    var r:AlertInput[] = [];
    for(let i = 0; i<this.elementAvailable.length; i++){
      r.push({
        label: this.elementAvailable[i],
        type:"radio",
        value: this.elementAvailable[i],
        checked: this.elementAvailable[i]==this.elementSelected,
        cssClass: `element-${this.elementAvailable[i]}`
      });
    }
    return r;
  }

  gearRadioGenerate(){
    var r:AlertInput[] = [];
    for(let i = 0; i<this.gearAvailable.length; i++){
      r.push({
        label: this.gearAvailable[i],
        type:"radio",
        value: this.gearAvailable[i],
        checked: this.gearAvailable[i]==this.gearSelected.type,
        cssClass: `gear-${this.gearAvailable[i].replace(" ","-")}`
      });
    }
    return r;
  }

  async changeElement(){
    const alert = await this.alert.create({
      header: "Select Element",
      backdropDismiss: true,
      inputs: this.eleRadioGenerate(),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.elementSelected = newSelected;
        }
      }]
    });
    alert.present();
  }

  async changeGear(){
    const alert = await this.alert.create({
      header: "Select Gear",
      backdropDismiss: true,
      inputs: this.gearRadioGenerate(),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.gearSelected.type = newSelected;
        }
      }]
    });
    alert.present();
  }

  async goMyChar(){
    this.nav.navigateForward('/my-char');
  }

  segmentChanged(event:any){
    this.typeSelected = event.detail.value;
  }

  async reloadChar(){
    this.char.charId = this.selectedChar;
    await this.char.loadStat(this.char.charId);
    this.curChar = JSON.parse(JSON.stringify(this.char.characterInfo));
    if(this.graphInitDone){
      this.chart.destroy();
      this.graphInitDone = false;
    }
    this.recalcStat();
  }

  async showHelp(section:any){
    const img = `assets/help/${section}.gif`;
    this.helpGif = img;
    return Promise.resolve();
  }

  async hideHelp(){
    this.helpGif = undefined;
    return Promise.resolve();
  }

  async help(section:string){
    const notice = await this.alert.create({
      cssClass: `help-popup-${section}`,
      backdropDismiss: true
    });
    notice.present();
  }

  changeEquipped(){
    this.recalcEquip("all");
  }

  addEquipment(atk?:number,eleAtk?:number,eleAtkPct?:number){
    this.equipment.push({attack:atk||0,eleAttack:eleAtk||0,eleAttackPercent:eleAtkPct||0,calculated:this.calcAtk(atk||0,eleAtk||0,eleAtkPct||0)});
  }

  removeEquipment(index:number){
    if(index == this.equipped) this.equipped = undefined;
    if(this.equipped && index < this.equipped) this.equipped--;
    this.equipment.splice(index,1);
    this.recalcEquip("all");
  }

  recalcEquip(i:number|"all"){
    if(i=="all"){
      if(this.equipment.length>0){
        for(let id=0;id<this.equipment.length;id++){
          this.equipment[id].calculated = this.calcAtk(this.equipment[id].attack,this.equipment[id].eleAttack,this.equipment[id].eleAttackPercent);
        }
      }
    } else {
      this.equipment[i].calculated = this.calcAtk(this.equipment[i].attack,this.equipment[i].eleAttack,this.equipment[i].eleAttackPercent);
    }
  }

  calcAtk(eqAtk:number,eqEleAtk:number,eqElePercent:number){
    const curPercent = this.yourStats.baseAtk!=0?this.yourStats.bonusAtk/this.yourStats.baseAtk:0;
    const basePercent = this.equipped!=undefined?(curPercent - (this.equipment[this.equipped].eleAttackPercent/100)):curPercent;
    const sharedAtk = (this.sharedStats.baseAtk+this.sharedStats.bonusAtk+this.sharedStats.enhanceAtk);
    const baseAtk = this.equipped!=undefined?(this.yourStats.baseAtk - (this.equipment[this.equipped].attack+this.equipment[this.equipped].eleAttack) - sharedAtk):this.yourStats.baseAtk;
    const eqFinAtk = eqAtk+eqEleAtk;
    const rBase = baseAtk+sharedAtk+eqFinAtk;
    const rPercent = Math.ceil(rBase*((eqElePercent/100)+basePercent));
    const rTotal = rBase+rPercent;
    const rGain = rTotal-(Math.ceil(baseAtk*basePercent))-(baseAtk);
    const result = {
      base: rBase,
      percent: rPercent,
      total: rTotal,
      gain: rGain
    }
    return result;
  }

  generateURL(): string {
    var segment = [];
    segment.push(this.elementAvailable.indexOf(this.elementSelected));
    segment.push(this.gearAvailable.indexOf(this.gearSelected.type));
    segment.push(this.yourStats.baseAtk);
    segment.push(this.yourStats.bonusAtk);
    segment.push(this.sharedStats.baseAtk);
    segment.push(this.sharedStats.enhanceAtk);
    segment.push(this.sharedStats.bonusAtk);
    segment.push(this.equipped);
    for (let i = 0; i < this.equipment.length; i++) {
      segment.push(this.equipment[i].attack);
      segment.push(this.equipment[i].eleAttack);
      segment.push(this.equipment[i].eleAttackPercent);
    }
    return segment.join("_");
  }

  urlShare(withDesc:boolean=true){
    var desc = `Check out my gear comparison!\n\nMy Stats:\n${this.elementSelected} Attack: ${this.yourStats.baseAtk} + ${this.yourStats.bonusAtk}\n\nGear Enhance:\nBase Attack: ${this.sharedStats.baseAtk}\nAttack Enhancement: ${this.sharedStats.enhanceAtk}\nEnhancement Unlocked (Attack): ${this.sharedStats.bonusAtk}\n`;
    for (let i = 0; i < this.equipment.length; i++) {
      desc += `\nGear #${i+1}${this.equipped==i?` (Equipped)`:``}:\nAttack: ${this.equipment[i].attack}\n${this.elementSelected} Attack: ${this.equipment[i].eleAttack} + ${this.equipment[i].eleAttackPercent}%\nTotal Attack: ${this.equipment[i].calculated.base} + ${this.equipment[i].calculated.percent} = ${this.equipment[i].calculated.total}\nAttack Gain: ${this.equipment[i].calculated.gain}\n`;
    }
    desc += `\nMore info or calculate your own at:`;
    const url = `https://tof.nandakho.my.id/gear-compare/${this.generateURL()}`;
    navigator.clipboard.writeText(`${withDesc?`${desc}\n`:``}${url}`);
    this.misc.showToast(`${withDesc?`Comparison info`:`Link`} copied to clipboard!`);
  }

  //get stats
  get hp() {
    return Math.round(this.curStat.getVal("HP")*(1+(this.curStat.getVal("HPPercent")/100)));
  }
  get hpOld() {
    return Math.round(this.char.characterStat.getVal("HP")*(1+(this.char.characterStat.getVal("HPPercent")/100)));
  }

  get crit() {
    return Math.floor(this.curStat.getVal("Crit"));
  }
  get critDamage() {
    return this.curStat.getVal("CritDamage");
  }
  get critPCalc() {
    return Math.floor((this.char.calcCrit(this.curStat.getVal("Crit"),"percent",this.curChar.level))*100)/100;
  }
  get critBCalc() {
    return Math.floor((this.char.calcCrit(this.curStat.getVal("CritPercent"),"base",this.curChar.level))*100)/100;
  }
  get critPercent() {
    return this.curStat.getVal("CritPercent");
  }
  get critOld() {
    return Math.floor(this.char.characterStat.getVal("Crit"));
  }
  get critPCalcOld() {
    return Math.floor((this.char.calcCrit(this.char.characterStat.getVal("Crit"),"percent",this.char.characterInfo.level))*100)/100;
  }
  get critBCalcOld() {
    return Math.floor((this.char.calcCrit(this.char.characterStat.getVal("CritPercent"),"base",this.char.characterInfo.level))*100)/100;
  }
  get critPercentOld() {
    return this.char.characterStat.getVal("CritPercent");
  }

  get physicalAtk() {
    return Math.round(Math.round((this.curStat.getVal("PhysicalAttack")+this.curStat.getVal("Attack")))*(1+(this.curStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalAtkB() {
    return Math.round(this.curStat.getVal("PhysicalAttack")+this.curStat.getVal("Attack"));
  }
  get physicalAtkP() {
    return Math.round((this.curStat.getVal("PhysicalAttack")+this.curStat.getVal("Attack"))*((this.curStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalDam() {
    return Math.round(this.curStat.getVal("PhysicalDamagePercent")*100)/100;
  }
  get physicalAtkOld() {
    return Math.round(Math.round((this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalAtkBOld() {
    return Math.round(this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack"));
  }
  get physicalAtkPOld() {
    return Math.round((this.char.characterStat.getVal("PhysicalAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("PhysicalAttackPercent")/100)));
  }
  get physicalDamOld() {
    return Math.round(this.char.characterStat.getVal("PhysicalDamagePercent")*100)/100;
  }

  get flameAtk() {
    return Math.round(Math.round((this.curStat.getVal("FlameAttack")+this.curStat.getVal("Attack")))*(1+(this.curStat.getVal("FlameAttackPercent")/100)));
  }
  get flameAtkB() {
    return Math.round(this.curStat.getVal("FlameAttack")+this.curStat.getVal("Attack"));
  }
  get flameAtkP() {
    return Math.round((this.curStat.getVal("FlameAttack")+this.curStat.getVal("Attack"))*((this.curStat.getVal("FlameAttackPercent")/100)));
  }
  get flameDam() {
    return Math.round(this.curStat.getVal("FlameDamagePercent")*100)/100;
  }
  get flameAtkOld() {
    return Math.round(Math.round((this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FlameAttackPercent")/100)));
  }
  get flameAtkBOld() {
    return Math.round(this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack"));
  }
  get flameAtkPOld() {
    return Math.round((this.char.characterStat.getVal("FlameAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("FlameAttackPercent")/100)));
  }
  get flameDamOld() {
    return Math.round(this.char.characterStat.getVal("FlameDamagePercent")*100)/100;
  }

  get frostAtk() {
    return Math.round(Math.round((this.curStat.getVal("FrostAttack")+this.curStat.getVal("Attack")))*(1+(this.curStat.getVal("FrostAttackPercent")/100)));
  }
  get frostAtkB() {
    return Math.round(this.curStat.getVal("FrostAttack")+this.curStat.getVal("Attack"));
  }
  get frostAtkP() {
    return Math.round((this.curStat.getVal("FrostAttack")+this.curStat.getVal("Attack"))*((this.curStat.getVal("FrostAttackPercent")/100)));
  }
  get frostDam() {
    return Math.round(this.curStat.getVal("FrostDamagePercent")*100)/100;
  }
  get frostAtkOld() {
    return Math.round(Math.round((this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("FrostAttackPercent")/100)));
  }
  get frostAtkBOld() {
    return Math.round(this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack"));
  }
  get frostAtkPOld() {
    return Math.round((this.char.characterStat.getVal("FrostAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("FrostAttackPercent")/100)));
  }
  get frostDamOld() {
    return Math.round(this.char.characterStat.getVal("FrostDamagePercent")*100)/100;
  }

  get voltAtk() {
    return Math.round(Math.round((this.curStat.getVal("VoltAttack")+this.curStat.getVal("Attack")))*(1+(this.curStat.getVal("VoltAttackPercent")/100)));
  }
  get voltAtkB() {
    return Math.round(this.curStat.getVal("VoltAttack")+this.curStat.getVal("Attack"));
  }
  get voltAtkP() {
    return Math.round((this.curStat.getVal("VoltAttack")+this.curStat.getVal("Attack"))*((this.curStat.getVal("VoltAttackPercent")/100)));
  }
  get voltDam() {
    return Math.round(this.curStat.getVal("VoltDamagePercent")*100)/100;
  }
  get voltAtkOld() {
    return Math.round(Math.round((this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack")))*(1+(this.char.characterStat.getVal("VoltAttackPercent")/100)));
  }
  get voltAtkBOld() {
    return Math.round(this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack"));
  }
  get voltAtkPOld() {
    return Math.round((this.char.characterStat.getVal("VoltAttack")+this.char.characterStat.getVal("Attack"))*((this.char.characterStat.getVal("VoltAttackPercent")/100)));
  }
  get voltDamOld() {
    return Math.round(this.char.characterStat.getVal("VoltDamagePercent")*100)/100;
  }

  get alterAtk() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]+this.curStat.getVal("AlterAttack"));
  }
  get alterAtkB() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]);
  }
  get alterAtkP() {
    return Math.floor(this.curStat.getVal("AlterAttack"));
  }
  get alterAtkOld() {
    return Math.floor([this.physicalAtkOld,this.flameAtkOld,this.frostAtkOld,this.voltAtkOld].sort((a,b)=>b-a)[0]+this.char.characterStat.getVal("AlterAttack"));
  }
  get alterAtkBOld() {
    return Math.floor([this.physicalAtkOld,this.flameAtkOld,this.frostAtkOld,this.voltAtkOld].sort((a,b)=>b-a)[0]);
  }
  get alterAtkPOld() {
    return Math.floor(this.char.characterStat.getVal("AlterAttack"));
  }
  get eleHighest() {
    return [{name:"Physical",val:this.physicalAtk},{name:"Flame",val:this.flameAtk},{name:"Frost",val:this.frostAtk},{name:"Volt",val:this.voltAtk}].sort((a,b)=>b.val-a.val)[0].name;
  }

  get physicalRes(){
    return Math.floor((this.curStat.getVal("PhysicalResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("PhysicalResistPercent")/100)));
  }
  get physicalResOld(){
    return Math.floor((this.char.characterStat.getVal("PhysicalResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("PhysicalResistPercent")/100)));
  }

  get flameRes(){
    return Math.floor((this.curStat.getVal("FlameResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("FlameResistPercent")/100)));
  }
  get flameResOld(){
    return Math.floor((this.char.characterStat.getVal("FlameResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("FlameResistPercent")/100)));
  }

  get frostRes(){
    return Math.floor((this.curStat.getVal("FrostResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("FrostResistPercent")/100)));
  }
  get frostResOld(){
    return Math.floor((this.char.characterStat.getVal("FrostResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("FrostResistPercent")/100)));
  }

  get voltRes(){
    return Math.floor((this.curStat.getVal("VoltResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("VoltResistPercent")/100)));
  }
  get voltResOld(){
    return Math.floor((this.char.characterStat.getVal("VoltResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("VoltResistPercent")/100)));
  }

  get alterRes(){
    return Math.floor((this.curStat.getVal("AlterResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("AlterResistPercent")/100)));
  }
  get alterResOld(){
    return Math.floor((this.char.characterStat.getVal("AlterResist")+this.char.characterStat.getVal("Resist"))*(1+(this.char.characterStat.getVal("AlterResistPercent")/100)));
  }

  get titanBlock(){
    return this.curStat.getVal("Block");
  }
  get titanBlockOld(){
    return this.char.characterStat.getVal("Block");
  }

  get titanWeak(){
    return this.curStat.getVal("Weak");
  }
  get titanWeakOld(){
    return this.char.characterStat.getVal("Weak");
  }
  
  get titanLifesteal(){
    return this.curStat.getVal("Lifesteal");
  }
  get titanLifestealOld(){
    return this.char.characterStat.getVal("Lifesteal");
  }
  
  get titanRecovery(){
    return this.curStat.getVal("Recovery");
  }
  get titanRecoveryOld(){
    return this.char.characterStat.getVal("Recovery");
  }
  
  get titanDelay(){
    return this.curStat.getVal("Delay");
  }
  get titanDelayOld(){
    return this.char.characterStat.getVal("Delay");
  }
  
  get titanNormal(){
    return this.curStat.getVal("Normal");
  }
  get titanNormalOld(){
    return this.char.characterStat.getVal("Normal");
  }
  
  get titanDodge(){
    return this.curStat.getVal("Dodge");
  }
  get titanDodgeOld(){
    return this.char.characterStat.getVal("Dodge");
  }
  
  get titanSkill(){
    return this.curStat.getVal("Skill");
  }
  get titanSkillOld(){
    return this.char.characterStat.getVal("Skill");
  }
  
  get titanDischarge(){
    return this.curStat.getVal("Discharge");
  }
  get titanDischargeOld(){
    return this.char.characterStat.getVal("Discharge");
  }
  
  get titanDamage(){
    return this.curStat.getVal("Damage");
  }
  get titanDamageOld(){
    return this.char.characterStat.getVal("Damage");
  }
  
  get titanReduction(){
    return this.curStat.getVal("Reduction");
  }
  get titanReductionOld(){
    return this.char.characterStat.getVal("Reduction");
  }
  
  get titanHeal(){
    return this.curStat.getVal("Heal");
  }
  get titanHealOld(){
    return this.char.characterStat.getVal("Heal");
  }

  async delCompare(id:number){
    const alert = await this.alert.create({
      header: `Delete This Gear?`,
      backdropDismiss: true,
      mode: "ios",
      buttons: [{
        text:'Keep'
      },{
        text:'Delete',
        cssClass: `del-btn`,
        handler: async ()=>{
          const idx = this.gearsCompare.findIndex(x=>x.id==id);
          this.gearsCompare.splice(idx,1);
          this.recalcCompareStat();
        }
      }]
    });
    alert.present();
  }

  newCompare(){
    const prevGear = this.char.characterInfo.gear[this.singleType];
    this.gearsCompare.push(JSON.parse(JSON.stringify({
      id: (this.gearsCompare[this.gearsCompare.length-1]?.id??0)+1,
      rarity: prevGear.rarity,
      random: prevGear.random,
      augment: prevGear.augment,
      rare: prevGear.rare,
      enhance: prevGear.enhance,
      compareStats: []
    })));
    this.graphRefresh();
  }

  eqTypeGenerate(){
    var r:AlertInput[] = [];
    for(const eq of this.eqOrder){
      r.push({
        label: eq,
        type: "radio",
        value: eq,
        checked: eq==this.singleType,
        cssClass: `gear-${eq.replace(" ","-")}-5`
      });
    }
    return r;
  }

  async typeChange(){
    const alert = await this.alert.create({
      header: `Select Part`,
      backdropDismiss: true,
      inputs: this.eqTypeGenerate(),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.singleType = newSelected;
          this.gearsCompare = [];
          this.recalcCompareStat();
        }
      }]
    });
    alert.present();
  }

  eqRadioGenerate(etype:gearTypes,id:number=0){
    const rarityList = augAvailable.includes(etype)?['5','Augment','Titan']:['5'];
    const curRar = id==0?this.curChar.gear[etype].rarity:this.gearsCompare.find(x=>x.id==id).rarity;
    var r:AlertInput[] = [{
      label: "Unequip",
      type: "radio",
      value: null,
      checked: curRar==null,
      cssClass: `eq-unequip`
    }];
    for(const m of rarityList){
      r.push({
        label: m==`5`?`${m}*`:m,
        type: "radio",
        value: m,
        checked: m==curRar,
        cssClass: `gear-${etype.replace(" ","-")}-${m}`
      });
    }
    return r;
  }

  async eqChange(etype:string):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Select ${part} Rarity`,
      backdropDismiss: true,
      inputs: this.eqRadioGenerate(part),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.curChar.gear[part].rarity = newSelected;
          this.recalcStat();
        }
      }]
    });
    alert.present();
  }

  async eqcompareChange(etype:string,id:number):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Select ${part} Rarity`,
      backdropDismiss: true,
      inputs: this.eqRadioGenerate(part,id),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.gearsCompare.find(x=>x.id==id).rarity = newSelected;
          this.recalcCompareStat();
        }
      }]
    });
    alert.present();
  }

  eqstatRadioGenerate(etype:gearTypes,index:number,parts:"random"|"augment",id:number=0){
    const curRand = id==0?(this.curChar.gear[etype][parts][index].type):this.gearsCompare.find(x=>x.id==id)[parts][index].type;
    let alrdSelected: any[] = [];
    let lists: string[] = [];
    alrdSelected = id==0?this.curChar.gear[etype].random.map(x=>x.type):this.gearsCompare.find(x=>x.id==id).random.map((y:any)=>y.type);
    if(parts=="random"){
      lists = this.rs[etype];
    } else {
      lists = this.as[etype];
      if(id==0){
        this.curChar.gear[etype].augment.map(x=>{
          alrdSelected.push(x.type);
        });
      } else {
        this.gearsCompare.find(x=>x.id==id).augment.map((y:any)=>{
          alrdSelected.push(y.type);
        });
      }
    }
    var r:AlertInput[] = [{
      label: "Empty",
      type: "radio",
      value: null,
      checked: curRand==null,
      cssClass: `eq-unequip`
    }];
    if(curRand!=null){
      r.push({
        label: this.beautifyStatString(curRand),
        type: "radio",
        value: curRand,
        checked: true,
        cssClass: `stat-${curRand}`
      })
    }
    for(const m of lists.sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      if(!alrdSelected.includes(m as any)){
        r.push({
          label: this.beautifyStatString(m),
          type: "radio",
          value: m,
          checked: m==curRand,
          cssClass: `stat-${m}`
        });
      }
    }
    return r;
  }

  async eqstatChange(etype:string,index:number,parts:"random"|"augment"):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Random ${index+1}`,
      backdropDismiss: true,
      inputs: this.eqstatRadioGenerate(part,index,parts),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.curChar.gear[part][parts][index].type = newSelected;
          this.recalcStat();
        }
      }]
    });
    alert.present();
  }

  async eqcomparestatChange(etype:string,index:number,parts:"random"|"augment",id:number):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Random ${index+1}`,
      backdropDismiss: true,
      inputs: this.eqstatRadioGenerate(part,index,parts,id),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.gearsCompare.find(x=>x.id==id)[parts][index].type = newSelected;
          this.recalcCompareStat();
        }
      }]
    });
    alert.present();
  }

  eqtitanRadioGenerate(etype:gearTypes,id:number=0){
    const curRare = id==0?(this.curChar.gear[etype].rare.type):this.gearsCompare.find(x=>x.id==id).rare.type;
    var r:AlertInput[] = [{
      label: "Empty",
      type: "radio",
      value: null,
      checked: curRare==null,
      cssClass: `eq-unequip`
    }];
    for(const m of this.ts[etype].sort((a,b)=>{
      if(a==b) return 0;
      if(a>b) return 1;
      return -1;
    })){
      r.push({
        label: this.beautifyStatString(m),
        type: "radio",
        value: m,
        checked: m==curRare,
        cssClass: `stat-${m}`
      });
    }
    return r;
  }

  async eqtitanChange(etype:string):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Rare ${etype}`,
      backdropDismiss: true,
      inputs: this.eqtitanRadioGenerate(part),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.curChar.gear[part].rare.type = newSelected;
          this.recalcStat();
        }
      }]
    });
    alert.present();
  }

  async eqcomparetitanChange(etype:string,id:number):Promise<void>{
    const part = etype as gearTypes;
    const alert = await this.alert.create({
      header: `Rare ${etype}`,
      backdropDismiss: true,
      inputs: this.eqtitanRadioGenerate(part,id),
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'OK',
        handler: async (newSelected)=>{
          this.gearsCompare.find(x=>x.id==id).rare.type = newSelected;
          this.recalcCompareStat();
        }
      }]
    });
    alert.present();
  }

  beautifyStatString(str:string|null):string {
    if(!str) return `-`;
    return (!["HP","HPPercent"].includes(str)?str.replace(/([A-Z])/g,' $1').trim():str).replace("Percent"," %");
  }
}

type elementAvailable = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
type pStats = {
  baseAtk: number,
  bonusAtk: number
}
interface eqStats extends augStat {
  calculated: {
    base: number;
    percent: number;
    total: number;
    gain: number
  };
}
