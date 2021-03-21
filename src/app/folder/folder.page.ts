import { UtteranceService } from './utterance.service';
import { DismissBamPage } from './../dismiss-bam/dismiss-bam.page';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})


export class FolderPage implements OnInit {
  public folder: string;
  toDo = new FormControl('');
  messageSent = '';
  messageReceived = '';
  isRecording = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private speechRecognition: SpeechRecognition,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private utteranceService: UtteranceService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.folder === 'Bam') {
      this.folder = 'Give me something to do.';
    }
    if (this.folder === 'Trello') {
      this.folder = 'My Stuff';
    }

    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission().then(
          () => console.log('Speech Recog Granted'),
          () => console.log('Speech Recog Denied')
        );
      }
    });
  }

  getSpeech() {
    // Check feature available
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) => {
        if (!available) {
          this.speechRecognition.requestPermission();
        }
        console.log(available);
      });
    // Start the recognition process
    this.speechRecognition
      .startListening()
      .subscribe((matches: Array<string>) => {
        this.toDo.setValue(matches[0]);
      });
    this.isRecording = true;
  }


  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }


  onBam() {
    this.stopListening();
    if (!this.toDo.value) {
      return;
    }
    this.modalController
      .create({
        component: DismissBamPage,
        componentProps: {
          messageSent: this.toDo.value,
          messageReceived: this.toDo.value,
        },
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        showBackdrop: true,
      })
      .then((modalEl) => {
        modalEl.present().then((foo) => {
          this.utteranceService.addUtterance(this.toDo.value, '');
          // .subscribe(() => {
          //   modalEl.dismiss();
          // })
        });
      });
  }

  isIos() {
    return this.platform.is('ios');
  }

}
