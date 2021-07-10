import { EditPageModule } from './my-stuff/edit/edit.module';
import { FinancialsPageModule } from './financials/financials.module';
import { FolderPageModule } from './folder/folder.module';
import { TagUtterancesPageModule } from './my-stuff/tag-utterances/tag-utterances.module';
import { environment } from './../environments/environment';
import { DismissBamPageModule } from './dismiss-bam/dismiss-bam.module';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ChartsModule } from 'ng2-charts';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DecimalPipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    DismissBamPageModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    TagUtterancesPageModule,
    FolderPageModule,
    ChartsModule,
    FinancialsPageModule,
    EditPageModule,

  ],
  providers: [
    SpeechRecognition,
    DecimalPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
