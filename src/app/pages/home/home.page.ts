import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  menus: menu[] = [
    {
      title: "Gear Compare",
      summary: "Which is better?",
      description: "Ever wonder which one give higher stats between flat attack and percentage one?\nWorry not, this tool can help you figure that out!",
      url: "gear-compare",
      background: "assets/background/compare.jpg",
    },
    {
      title: "Crit Calc (Soon)",
      summary: "Crit chance? But isn't that obvious?",
      description: "Nope!\nIn game stat only tells you the chance to crit against target with the same level.\nThen you see enemy with higher or lower level in some instance, what's your crit chance against them?",
      url: "",
      background: "assets/background/compare.jpg",
    }
  ];
  constructor(
    private nav: NavController,
    private titleService: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Tools of Fantasy");
    this.meta.updateTag({ property: 'og:url', content:'https://tof.nandakho.my.id/home'});
    this.meta.updateTag({ property: 'og:title', content:"Tools of Fantasy" });
    this.meta.updateTag({ property: 'og:image', content: "https://tof.nandakho.my.id/assets/icon/icon.png"});
    this.meta.updateTag({ property: 'og:description', content:  "Tools for Tower of Fantasy"});
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