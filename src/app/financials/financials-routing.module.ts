import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancialsPage } from './financials.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialsPage
  },  {
    path: 'how-much',
    loadChildren: () => import('./how-much/how-much.module').then( m => m.HowMuchPageModule)
  },
  {
    path: 'new-month',
    loadChildren: () => import('./new-month/new-month.module').then( m => m.NewMonthPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialsPageRoutingModule {}
