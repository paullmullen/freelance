import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancialsPage } from './financials.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialsPageRoutingModule {}
