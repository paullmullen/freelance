import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DismissBamPageRoutingModule } from './dismiss-bam-routing.module';

import { DismissBamPage } from './dismiss-bam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DismissBamPageRoutingModule
  ],
  declarations: [DismissBamPage]
})
export class DismissBamPageModule {}
