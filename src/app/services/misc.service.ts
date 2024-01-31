import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

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
