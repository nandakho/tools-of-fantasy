import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage implements OnInit {
  characterInfo: characterInfo|undefined = undefined;
  constructor() { }

  ngOnInit() {
    this.loadExisting();
  }

  async loadExisting(){
    const c = await Preferences.get({key:`character`});
    this.characterInfo = JSON.parse(c.value??"");
  }
}

interface characterInfo {
  uid: number|null;
  name: string|null;
  weapon: weaponList[];
}

type atkType = "Attack"|"Fortitude"|"Benediction";
interface weaponList {
  name: string;
  type: atkType;
  level: number;
}