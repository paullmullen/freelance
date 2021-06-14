import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewMonthPageRoutingModule } from './new-month-routing.module';

import { NewMonthPage } from './new-month.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewMonthPageRoutingModule
  ],
  declarations: [NewMonthPage]
})
export class NewMonthPageModule {}
