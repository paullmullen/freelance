import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BamPageRoutingModule } from './bam-routing.module';

import { BamPage } from './bam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BamPageRoutingModule
  ],
  declarations: [BamPage]
})
export class BamPageModule {}
