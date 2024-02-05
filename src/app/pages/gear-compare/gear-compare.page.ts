import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AlertInput, NavController } from '@ionic/angular';
import { MiscService, augStat, basicStat, statTypes, gear, gearTypes, CharacterService, characterInfo, randomStatList, augStatList, titanStatList, augAvailable, StatsService, GearsService } from 'src/app/services';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage {
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
  changedOnly: boolean = false;
  changedStats: any[] = [];
  curChar: characterInfo = this.char.initCharacterInfo();
  curStat = new StatsService();
  eqOrder: gearTypes[] = ["Helm","Eyepiece","Spaulders","Handguards","Bracers","Armor","Combat Engine","Belt","Legguards","Sabatons","Exoskeleton","Microreactor"];
  multiType: boolean = false;
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

  ionViewWillEnter(){
    this.curChar = JSON.parse(JSON.stringify(this.char.characterInfo));
    this.recalcStat();
  }

  recalcStat(){
    this.changedStats = [];
    this.curStat.initAll();
    this.curStat.add(this.char.characterStat.getAll());
    let oldGear = new StatsService();
    oldGear.add(this.gears.calc(this.char.characterInfo.gear));
    for(let [k,v] of Object.entries(oldGear.getAll())){
      this.curStat.addVal(k as statTypes,(-v));
    }
    this.curStat.add(this.gears.calc(this.curChar.gear));
    for(let [kk,vv] of Object.entries(this.char.characterStat.getAll())){
      const cv = this.curStat.getVal(kk as statTypes);
      if(cv!=vv){
        console.log(`${kk} changed from ${vv} to ${cv}`);
      }
    }
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
    await this.char.loadStat(this.char.charId);
    this.curChar = JSON.parse(JSON.stringify(this.char.characterInfo));
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

  get crit() {
    return Math.floor(this.curStat.getVal("Crit"));
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

  get alterAtk() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]+this.curStat.getVal("AlterAttack"));
  }
  get alterAtkB() {
    return Math.floor([this.physicalAtk,this.flameAtk,this.frostAtk,this.voltAtk].sort((a,b)=>b-a)[0]);
  }
  get alterAtkP() {
    return Math.floor(this.curStat.getVal("AlterAttack"));
  }
  get eleHighest() {
    return [{name:"Physical",val:this.physicalAtk},{name:"Flame",val:this.flameAtk},{name:"Frost",val:this.frostAtk},{name:"Volt",val:this.voltAtk}].sort((a,b)=>b.val-a.val)[0].name;
  }

  get physicalRes(){
    return Math.floor((this.curStat.getVal("PhysicalResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("PhysicalResistPercent")/100)));
  }

  get flameRes(){
    return Math.floor((this.curStat.getVal("FlameResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("FlameResistPercent")/100)));
  }

  get frostRes(){
    return Math.floor((this.curStat.getVal("FrostResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("FrostResistPercent")/100)));
  }

  get voltRes(){
    return Math.floor((this.curStat.getVal("VoltResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("VoltResistPercent")/100)));
  }

  get alterRes(){
    return Math.floor((this.curStat.getVal("AlterResist")+this.curStat.getVal("Resist"))*(1+(this.curStat.getVal("AlterResistPercent")/100)));
  }

  get titanBlock(){
    return this.curStat.getVal("Block");
  }

  get titanWeak(){
    return this.curStat.getVal("Weak");
  }
  
  get titanLifesteal(){
    return this.curStat.getVal("Lifesteal");
  }
  
  get titanRecovery(){
    return this.curStat.getVal("Recovery");
  }
  
  get titanDelay(){
    return this.curStat.getVal("Delay");
  }
  
  get titanNormal(){
    return this.curStat.getVal("Normal");
  }
  
  get titanDodge(){
    return this.curStat.getVal("Dodge");
  }
  
  get titanSkill(){
    return this.curStat.getVal("Skill");
  }
  
  get titanDischarge(){
    return this.curStat.getVal("Discharge");
  }
  
  get titanDamage(){
    return this.curStat.getVal("Damage");
  }
  
  get titanReduction(){
    return this.curStat.getVal("Reduction");
  }
  
  get titanHeal(){
    return this.curStat.getVal("Heal");
  }

  eqRadioGenerate(etype:gearTypes){
    const rarityList = augAvailable.includes(etype)?['5','Augment','Titan']:['5'];
    const curRar = this.curChar.gear[etype].rarity;
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

  eqstatRadioGenerate(etype:gearTypes,index:number,parts:"random"|"augment"){
    const curRand = (this.curChar.gear[etype][parts][index].type);
    let alrdSelected: any[] = [];
    let lists: string[] = [];
    alrdSelected = this.curChar.gear[etype].random.map(x=>x.type);
    if(parts=="random"){
      lists = this.rs[etype];
    } else {
      lists = this.as[etype];
      this.curChar.gear[etype].augment.map(x=>{
        alrdSelected.push(x.type);
      });
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

  eqtitanRadioGenerate(etype:gearTypes){
    const curRare = (this.curChar.gear[etype].rare.type);
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