import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'gear-compare',
    loadChildren: () => import('./pages/gear-compare/gear-compare.module').then( m => m.GearComparePageModule)
  },
  {
    path: 'gear-compare/:attr',
    loadChildren: () => import('./pages/gear-compare/gear-compare.module').then( m => m.GearComparePageModule)
  },
  {
    path: 'crit-calc',
    loadChildren: () => import('./pages/crit-calc/crit-calc.module').then( m => m.CritCalcPageModule)
  },
  {
    path: 'crit-calc/:attr',
    loadChildren: () => import('./pages/crit-calc/crit-calc.module').then( m => m.CritCalcPageModule)
  },
  {
    path: '**',
    redirectTo: '',  
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
