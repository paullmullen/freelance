import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancialsPageRoutingModule } from './financials-routing.module';

import { FinancialsPage } from './financials.page';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialsPageRoutingModule,
    ChartsModule
  ],
  declarations: [FinancialsPage]
})
export class FinancialsPageModule {}
