import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMonthPage } from './new-month.page';

const routes: Routes = [
  {
    path: '',
    component: NewMonthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewMonthPageRoutingModule {}
