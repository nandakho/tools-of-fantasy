import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { ConstService } from './services';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appTitle: string = "Tools of Fantasy";
  gitLink: string = "https://github.com/nandakho/tools-of-fantasy";
  psLink: string = "https://play.google.com/store/apps/details?id=id.my.nandakho.tofu";
  public appPages = [
    { title: 'My Character', url: 'my-char', icon: 'person' },
    { title: 'Gear Compare', url: 'gear-compare', icon: 'search' },
    { title: 'Crit Calc', url: 'crit-calc', icon: 'sparkles' },
  ];
  constructor(
    public con: ConstService,
    private alert: AlertController
  ) {
    this.setConstant();
  }

  async setConstant(){
    this.con.mode = Capacitor.getPlatform();
    if(this.con.mode!="web"){
      const info = await App.getInfo();
      let v = info.version.split(this.con.verSep);
      this.con.version = {major:parseInt(v[0]),minor:parseInt(v[1]),patch:parseInt(v[2])};
    }
  }

  async visit(page:string){
    let link = ``;
    switch(page){
      case `Playstore`:
        link = this.psLink;
        break;
      case `Github`:
        link = this.gitLink;
        break;
    }
    const alert = await this.alert.create({
      header: `Visit ${page}?`,
      backdropDismiss: true,
      mode: "ios",
      buttons: [{
        text:'Cancel'
      },{
        text:'Go!!',
        handler: ()=>{
          window.open(link);
        }
      }]
    });
    alert.present();
  }
}
