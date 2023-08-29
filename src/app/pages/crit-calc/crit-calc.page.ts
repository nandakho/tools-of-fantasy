import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-crit-calc',
  templateUrl: './crit-calc.page.html',
  styleUrls: ['./crit-calc.page.scss'],
})
export class CritCalcPage {
  url: string|null = '';
  typeSelected: 0|1 = 0;
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
  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title
  ) {
    this.serverSide();
  }

  serverSide(){
    this.url = this.route.snapshot.paramMap.get('attr');
    if(this.url){
      const attr = this.url.split("_");
      this.typeSelected = parseInt(attr[0])==1?1:0;
      if(attr.length==3){
        if(this.typeSelected==0){
          this.bCrit = {
            targetLevel: parseInt(attr[1]),
            baseCrit: 0,
            finalCrit: parseFloat(attr[2])
          }
          this.recalcCrit("base");
        } else {
          this.pCrit = {
            targetLevel: parseInt(attr[1]),
            baseCrit: parseInt(attr[2]),
            finalCrit: 0
          }
          this.recalcCrit("percent");
        }
      }
    }
    this.setTag();
  }

  setTag(){
    var desc = this.url?``:`Let's calculate your crit % or base crit needed!`;
    if(this.typeSelected==0){
      desc += `How much base crit you need?${this.url?`\nAgainst lvl: ${this.bCrit.targetLevel}, Crit % wanted: ${this.bCrit.finalCrit}%\nBase crit needed: ${this.bCrit.baseCrit}`:''}`;
    } else {
      desc += `What is your crit % chance?${this.url?`\nAgainst lvl: ${this.pCrit.targetLevel}, Your base crit: ${this.pCrit.baseCrit}\nCrit % chance is: ${this.pCrit.finalCrit}%`:''}`;
    }
    this.title.setTitle(`Tools of Fantasy - Crit Calc`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: `/crit-calc${this.url?'/'+this.url:''}` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `Tools of Fantasy - Crit Calc` });
    this.meta.updateTag({ property: 'og:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: `Tools of Fantasy - Crit Calc` });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
  }

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