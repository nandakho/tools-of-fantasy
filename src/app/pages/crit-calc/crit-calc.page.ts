import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { MiscService, CharacterService } from 'src/app/services';

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
    private title: Title,
    private misc: MiscService,
    private char: CharacterService
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
        this.bCrit.baseCrit = this.char.calcCrit(this.bCrit.finalCrit,"base",this.bCrit.targetLevel);
        break;
      case "percent":
        this.pCrit.finalCrit = this.char.calcCrit(this.pCrit.baseCrit,"percent",this.pCrit.targetLevel);
        break;
    }
  }

  generateURL(type:0|1){
    var segment = [];
    segment.push(type);
    segment.push(type==0?this.bCrit.targetLevel??0:this.pCrit.targetLevel??0);
    segment.push(type==0?this.bCrit.finalCrit??0:this.pCrit.baseCrit??0);
    return segment.join("_");
  }

  urlShare(type:0|1=0,withDesc:boolean=true){
    var desc = type==0?`You need "${this.bCrit.baseCrit}" crit to reach ${this.bCrit.finalCrit}% crit chance against level ${this.bCrit.targetLevel} enemy!`:`With ${this.pCrit.baseCrit} crit, your chance of hitting crit against level ${this.pCrit.targetLevel} enemy is "${this.pCrit.finalCrit}%"!`;
    desc += `\nMore info or calculate your own at:`;
    const url = `https://tof.nandakho.my.id/crit-calc/${this.generateURL(type)}`;
    navigator.clipboard.writeText(`${withDesc?`${desc}\n`:``}${url}`);
    this.misc.showToast(`${withDesc?`Crit info`:`Link`} copied to clipboard!`);
  }
}

interface crit {
  targetLevel: number,
  baseCrit: number,
  finalCrit: number
}