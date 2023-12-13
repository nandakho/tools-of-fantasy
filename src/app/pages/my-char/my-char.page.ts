import { Component, OnInit } from '@angular/core';
import { CharacterService, characterInfo, weaponAvailable } from 'src/app/services';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage implements OnInit {
  wp = Object.keys(weaponAvailable);
  constructor(
    public char: CharacterService
  ) { }

  ngOnInit() { }
  tes(){
    console.log(this.char.characterInfo);
  }
}