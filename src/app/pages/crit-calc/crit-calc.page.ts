import { Component } from '@angular/core';

@Component({
  selector: 'app-crit-calc',
  templateUrl: './crit-calc.page.html',
  styleUrls: ['./crit-calc.page.scss'],
})
export class CritCalcPage {
  pCrit:crit = {
    targetLevel: 0,
    baseCrit: 0,
    finalCrit: 0
  }
  bCrit:crit = {
    targetLevel: 0,
    baseCrit: 0,
    finalCrit: 0
  }
  constructor() { }

  recalcCrit(targetType:"base"|"percent"):void {
    switch(targetType){
      case "base":
        this.bCrit.baseCrit = this.calcCrit(this.bCrit.finalCrit,"base",this.bCrit.targetLevel);
        break;
      case "percent":
        this.pCrit.finalCrit = this.calcCrit(this.pCrit.baseCrit,"percent",this.pCrit.targetLevel);
        break;
    }
  }

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
  getConstant(level:number):constant {
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
}

interface crit {
  targetLevel: number,
  baseCrit: number,
  finalCrit: number
}

interface constant {
  a: number,
  b: number,
  c: number
}