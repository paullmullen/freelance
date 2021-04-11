import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BamPage } from './bam.page';

const routes: Routes = [
  {
    path: '',
    component: BamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BamPageRoutingModule {}
