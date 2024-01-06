import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { Title, Meta } from '@angular/platform-browser';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  menus: menu[] = [
    {
      title: "My Character",
      summary: "All about your character",
      description: "Configure your character here, and it will be integrated on other tools!\nNeat right?",
      url: "my-char",
      background: "assets/background/my-char.jpg",
    },
    {
      title: "Gear Compare",
      summary: "Which is better?",
      description: "Ever wonder which one give higher stats between flat attack and percentage one?\nWorry not, this tool can help you figure that out!",
      url: "gear-compare",
      background: "assets/background/gear-compare.jpg",
    },
    {
      title: "Crit Calc",
      summary: "Crit chance? But isn't that obvious?",
      description: "Nope!\nIn game stat only tells you the chance to crit against target with the same level.\nThen you see enemy with higher or lower level in some instance, what's your crit chance against them?",
      url: "crit-calc",
      background: "assets/background/crit-calc.jpg",
    }
  ];
  constructor(
    private meta: Meta,
    private title: Title,
    private nav: NavController
  ) {
    this.setTag();
  }

  setTag(){
    const title = `Tools of Fantasy`;
    const desc = `Tools for Tower of Fantasy`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: `` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `Tools of Fantasy` });
    this.meta.updateTag({ property: 'og:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: `Tools of Fantasy` });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tof.nandakho.my.id/assets/icon/icon.png' });
  }

  async goTo(url:any){
    await this.nav.navigateRoot(url);
  }
}

interface menu {
  title: string;
  background?: string;
  summary?: string;
  description?: string;
  url?: string;
}