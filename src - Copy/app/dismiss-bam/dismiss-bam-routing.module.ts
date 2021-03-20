import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DismissBamPage } from './dismiss-bam.page';

const routes: Routes = [
  {
    path: '',
    component: DismissBamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DismissBamPageRoutingModule {}
