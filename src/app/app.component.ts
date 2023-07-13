import { Component } from '@angular/core';
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
  constructor() {}
}
