import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyStuffPageRoutingModule } from './my-stuff-routing.module';

import { MyStuffPage } from './my-stuff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyStuffPageRoutingModule
  ],
  declarations: [MyStuffPage]
})
export class MyStuffPageModule {}
