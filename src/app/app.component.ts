import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appTitle: string = "Tools of Fantasy";
  gitLink: string = "https://github.com/nandakho/tools-of-fantasy";
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Gear Compare', url: '/gear-compare', icon: 'search' },
  ];
  constructor(
    private titleService: Title,
    private meta: Meta
  ) {
    this.titleService.setTitle("Tools of Fantasy");
    this.meta.updateTag({ property: 'og:url', content:'https://tof.nandakho.my.id'});
    this.meta.updateTag({ property: 'og:title', content:"Tools of Fantasy" });
    this.meta.updateTag({ property: 'og:image', content: "https://tof.nandakho.my.id/assets/icon/icon.png"});
    this.meta.updateTag({ property: 'og:description', content:  "Tools for Tower of Fantasy"});
  }
}
