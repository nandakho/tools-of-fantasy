import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCharPage } from './my-char.page';

const routes: Routes = [
  {
    path: '',
    component: MyCharPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCharPageRoutingModule {}
