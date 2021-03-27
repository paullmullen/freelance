import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DismissBamPageModule } from './dismiss-bam/dismiss-bam.module';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            CommonModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            DismissBamPageModule,
            FormsModule, ReactiveFormsModule,
            HttpClientModule,
            // IonicStorageModule.forRoot(),
           ],
  providers: [SpeechRecognition, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
