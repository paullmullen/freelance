import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagUtterancesPageRoutingModule } from './tag-utterances-routing.module';

import { TagUtterancesPage } from './tag-utterances.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagUtterancesPageRoutingModule
  ],
  declarations: [TagUtterancesPage]
})
export class TagUtterancesPageModule {}
