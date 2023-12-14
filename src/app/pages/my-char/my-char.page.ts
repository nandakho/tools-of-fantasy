import { Component, OnInit } from '@angular/core';
import { matrixType,CharacterService, weaponAvailable, matrixAvailable, serverList, supreAvailable, gearAvailable, randomStatList, titanStatList, augAvailable, matrix } from 'src/app/services';

@Component({
  selector: 'app-my-char',
  templateUrl: './my-char.page.html',
  styleUrls: ['./my-char.page.scss'],
})
export class MyCharPage implements OnInit {
  wp = Object.keys(weaponAvailable);
  mt = matrixAvailable.List;
  sp = Object.keys(supreAvailable).map(x=>{
    return {k:x,v:x.replace("_",".")}
  });
  gr = Object.keys(gearAvailable);
  rs = randomStatList;
  ts = titanStatList;
  al = augAvailable;
  server:serverList[] = ["Asia Pacific","Europe","North America","South America","Southeast Asia"];
  constructor(
    public char: CharacterService
  ) { }

  ngOnInit() { }

  async unequipWeapon(idx:number){
    this.char.characterInfo.weapon[idx].name=null;
    await this.saveChanges();
  }

  async unequipMatrix(wIdx:number,mType:any){
    const x:matrixType = mType;
    this.char.characterInfo.weapon[wIdx].matrix[x].name=null;
    await this.saveChanges();
  }

  async saveChanges(){
    console.log(this.char.characterInfo);
    await this.char.saveStat();
  }
}