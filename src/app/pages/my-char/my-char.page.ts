import { Component, OnInit } from '@angular/core';
import { CharacterService, characterInfo } from 'src/app/services';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage implements OnInit {
  constructor(
    public char: CharacterService
  ) { }

  ngOnInit() { }
}