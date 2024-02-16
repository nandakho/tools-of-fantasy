import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstService {
  private currentMode: string = "web";
  private clientVer: {major: number;minor: number;patch: number;} = {major: 0,minor: 0,patch: 0};
  constructor() { }

  set mode(what:string){
    this.currentMode = what;
  }
  get mode(){
    return this.currentMode;
  }
  get modeCapitalize(){
    return `${this.currentMode[0].toUpperCase()}${this.currentMode.slice(1)}`;
  }

  set version(ver:{major: number;minor: number;patch: number;}){
    this.clientVer = ver;
  }
  get version(){
    return this.clientVer;
  }
  get verSep(){
    return ".";
  }
  get verString(){
    const varr = [this.version.major,this.version.minor,this.version.patch];
    return varr.join(this.verSep);
  }
}