import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowMuchPage } from './how-much.page';

const routes: Routes = [
  {
    path: '',
    component: HowMuchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowMuchPageRoutingModule {}
