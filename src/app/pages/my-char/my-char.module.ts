import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCharPageRoutingModule } from './my-char-routing.module';

import { MyCharPage } from './my-char.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCharPageRoutingModule
  ],
  declarations: [MyCharPage]
})
export class MyCharPageModule {}
