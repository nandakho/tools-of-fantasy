import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor(
    private toast: ToastController
  ) { }
  
  /**
   * Show toast, automatically push existing toast up if another toast is called
   * @param message What you want to tell
   * @param duration How long shall it be shown in ms (default 3000ms)
   */
  async showToast(message:string,duration:number=3000):Promise<void>{
    var allToast = document.querySelectorAll('ion-toast');
    const newToast = await this.toast.create({message:message,duration:duration});
    await newToast.present();
    var newHeight = newToast.shadowRoot?.children.item(0)?.getBoundingClientRect().height;
    if(allToast.length>0){
      for (let index = 0; index < allToast.length; index++) {
        const element = allToast.item(index).getBoundingClientRect();
        allToast.item(index).style.position = "fixed";
        allToast.item(index).style.top = String(element.top-(newHeight??0)-2)+"px";
      }
    }
    newToast.style.opacity = "100%";
    return Promise.resolve();
  }

  async writeFile(data:string, name:string, opt?:{directory?:Directory, path?:string}):Promise<string>{
    return new Promise(async (resolve,reject)=>{
      let path = ``;
      if(opt?.path){
        if(opt.path!=''){
          path = `${opt.path}`;
          if(!opt.path.endsWith("/")) path+=`/`;
        }
      }
      try {
        const status = await Filesystem.checkPermissions();
        if(status.publicStorage!="granted"){
          await Filesystem.requestPermissions();
        }
        const uri = await Filesystem.writeFile({data:data,directory:(opt?.directory??Directory.Documents),path:`${path}${name}`,recursive:true});
        return resolve(uri.uri);
      } catch (err) {
        return reject(err);
      }
    });
  }

  decodeString(str:string):string{
    const d = new TextDecoder();
    const arr = Uint8Array.from(str.split(",").map(x=>parseInt(x)));
    return d.decode(arr);
  }

  encodeString(str:string):string{
    const e = new TextEncoder();
    return Array.from(e.encode(str)).join(",");
  }
}
