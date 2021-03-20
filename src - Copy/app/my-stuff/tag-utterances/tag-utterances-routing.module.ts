import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagUtterancesPage } from './tag-utterances.page';

const routes: Routes = [
  {
    path: '',
    component: TagUtterancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagUtterancesPageRoutingModule {}
