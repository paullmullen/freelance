import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancialsPageRoutingModule } from './financials-routing.module';

import { FinancialsPage } from './financials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialsPageRoutingModule
  ],
  declarations: [FinancialsPage]
})
export class FinancialsPageModule {}
