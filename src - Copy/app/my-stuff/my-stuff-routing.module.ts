import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyStuffPage } from './my-stuff.page';

const routes: Routes = [
  {
    path: '',
    component: MyStuffPage
  },
  {
    path: 'tag-utterances',
    loadChildren: () => import('./tag-utterances/tag-utterances.module').then( m => m.TagUtterancesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyStuffPageRoutingModule {}
