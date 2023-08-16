import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CritCalcPageRoutingModule } from './crit-calc-routing.module';

import { CritCalcPage } from './crit-calc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CritCalcPageRoutingModule
  ],
  declarations: [CritCalcPage]
})
export class CritCalcPageModule {}
