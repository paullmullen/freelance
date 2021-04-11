import { ParseService } from './parse.service';
import { Utterance } from './utterance.model';

import { UtteranceService } from './utterance.service';
import { DismissBamPage } from './../dismiss-bam/dismiss-bam.page';
import { IonRouterOutlet, ModalController, isPlatform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-bam-form',
  templateUrl: './bam.page.html',
  styleUrls: ['./bam.page.scss'],
})
export class BamPage implements OnInit {
  public folder: string;
  messageSent = '';
  messageReceived = '';
  isRecording = false;
  usersName: string;
  usersEmail: string;
  usersUid: string;
  toDo = new Utterance('', '', '', '', false, '', '', '');
  categoryExists = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private speechRecognition: SpeechRecognition,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private utteranceService: UtteranceService,
    private parseService: ParseService
  ) {}

  ngOnInit() {
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission().then(
          () => console.log('Speech Recog Granted'),
          () => console.log('Speech Recog Denied')
        );
      }
    });
  }

  ionViewWillEnter() {
    this.usersName = JSON.parse(localStorage.getItem('user')).displayName;
    this.usersEmail = JSON.parse(localStorage.getItem('user')).email;
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
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
    this.toDo.utterance = 'Listening...';
    // Start the recognition process
    this.speechRecognition
      .startListening()
      .subscribe((matches: Array<string>) => {
        this.toDo.utterance = matches[0];
      });
    this.isRecording = true;
  }

  stopListening() {
    // Note that Stop listening is only required for iOS.
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  onChange() {
    const tempString = this.toDo.utterance.toLowerCase();
    if (this.parseService.getImportance(this.toDo.utterance)) {
      this.toDo.importance = 'Important';
    } else {
      this.toDo.importance = '';
    }
    if (this.parseService.getUrgency(this.toDo.utterance)) {
      this.toDo.urgency = 'Urgent';
    } else {
      this.toDo.urgency = '';
    }
    if (this.parseService.getProject(this.toDo.utterance).length > 0) {
      this.toDo.project = this.parseService.getProject(this.toDo.utterance);
      this.categoryExists = true;
    } else {
      this.toDo.project = '';
      this.categoryExists = false;
    }
  }


  onBam() {
    this.stopListening();
    if (!this.toDo) {
      return;
    }



    this.modalController
      .create({
        component: DismissBamPage,
        componentProps: {
          messageSent: this.parseService.getCleanUtterance(this.toDo.utterance),
          messageReceived: this.parseService.getCleanUtterance(this.toDo.utterance),
        },
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        showBackdrop: true,
      })
      .then((modalEl) => {
        modalEl.present().then((foo) => {
          this.utteranceService.addUtterance(this.parseService.getCleanUtterance(this.toDo.utterance), // utterance itself
                                            '', // tag
                                            this.usersUid, // userId
                                            (this.parseService.getUrgency(this.toDo.utterance)) ? 'Urgent' : '', // urgency
                                            (this.parseService.getImportance(this.toDo.utterance)) ? 'Important' : '', // importance
                                            this.parseService.getProject(this.toDo.utterance) // project
                                            );

        });
      });
  }

  isIos() {
    return isPlatform('ios');
  }
}
