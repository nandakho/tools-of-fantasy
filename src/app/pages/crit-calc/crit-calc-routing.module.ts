import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CritCalcPage } from './crit-calc.page';

const routes: Routes = [
  {
    path: '',
    component: CritCalcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CritCalcPageRoutingModule {}
