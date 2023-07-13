import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GearComparePageRoutingModule } from './gear-compare-routing.module';

import { GearComparePage } from './gear-compare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GearComparePageRoutingModule
  ],
  declarations: [GearComparePage]
})
export class GearComparePageModule {}
