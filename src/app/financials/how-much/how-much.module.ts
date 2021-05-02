import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowMuchPageRoutingModule } from './how-much-routing.module';

import { HowMuchPage } from './how-much.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowMuchPageRoutingModule
  ],
  declarations: [HowMuchPage]
})
export class HowMuchPageModule {}
