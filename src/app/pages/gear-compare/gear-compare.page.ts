import { Component, OnInit } from '@angular/core';
import { gear } from 'src/app/services';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage implements OnInit {
  elementSelected:elementAvailable = "Flame";
  elementAvailable:elementAvailable[] = ["Flame","Frost","Physical","Volt","Altered"];
  yourStats:stats = {
    baseAtk: 0,
    percentAtk: 0
  }
  equipment: any[] = [];
  constructor() { }

  ngOnInit() {
  }

  changeElement(){
    console.log(`Popup element selection here!`);
  }

  help(section:string){
    console.log(`Popup help about: ${section}`);
  }

  addEquipment(){
    this.equipment.push({type:"tes"});
  }

  removeEquipment(index:number){
    this.equipment.splice(index,1);
    console.log(this.equipment);
  }
}

type elementAvailable = "Flame"|"Frost"|"Physical"|"Volt"|"Altered";
type stats = {
  baseAtk: number,
  percentAtk: number
}