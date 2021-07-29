import { DismissBamPage } from './../dismiss-bam/dismiss-bam.page';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LexRuntime } from 'aws-sdk';
import { Message } from '../messages';
import { environment } from '../../environments/environment';
import { QuotationsService } from './../summary/quotations.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  form: FormGroup;
  lex: LexRuntime;
  toDo: string = '';
  messages: Message[] = [];
  lexState: string = "OK, what's up?";
  messageSent: string = '';
  messageReceived: string = '';
  usersName: string;
  usersEmail: string;
  usersUid: string;
  quoteObject: any;
  quoteCategories: any;
  quoteCategoriesArray;
  selectedQuotation: string;
  qrCodeText: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private speechRecognition: SpeechRecognition,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private QuotationsService: QuotationsService
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.folder === 'Bam') {
      this.folder = 'Give me something to do.';
    }
    if (this.folder === 'Trello') {
      this.folder = 'My Stuff';
    }

    this.form = new FormGroup({
      toDo: new FormControl(null, {
        updateOn: 'blur',
        // validators: [Validators.required],
      }),
    });

    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission().then(
          () => console.log('Speech Recog Granted'),
          () => console.log('Speech Recog Denied')
        );
      }
    });
    this.getQuoteCategories();
  }

  ionViewWillEnter() {
    this.usersName = JSON.parse(localStorage.getItem('user')).displayName;
    this.usersEmail = JSON.parse(localStorage.getItem('user')).email;
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
    this.qrCodeText =
      'https://api.qrserver.com/v1/create-qr-code?data=' +
      this.usersUid+'&amp;size=150x150';
    console.log(this.usersUid);
    try {
      this.selectedQuotation = localStorage.getItem('selectedQuotation');
      if (this.selectedQuotation === null) {
        this.selectedQuotation = 'inspire';
        localStorage.setItem('selectedQuotation', 'inspire');
      }
    } catch {
      this.selectedQuotation = 'inspire';
      localStorage.setItem('selectedQuotation', 'inspire');
    }
  }

  getSpeech() {
    // Check feature available
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) => console.log(available));

    // Start the recognition process
    this.speechRecognition
      .startListening()
      .subscribe((matches: Array<string>) => {
        this.form.patchValue({ toDo: matches[0] });
      });
  }

  onBam() {
    if (!this.toDo) {
      return;
    }
    this.modalController
      .create({
        component: DismissBamPage,
        componentProps: {
          messageSent: this.messageSent,
          messageReceived: this.messageReceived,
        },
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        showBackdrop: true,
      })
      .then((modalEl) => {
        this.postLexText();
        modalEl.present();
      });

    this.form.patchValue({ toDo: null });
  }

  postLexText() {
    let params = {
      botAlias: '$LATEST',
      botName: 'freelancer',
      inputText: 'testing',
      userId: 'User',
    };
    this.lex = new LexRuntime({
      accessKeyId: environment.AWSAPIKEY,
      secretAccessKey: environment.AWSSECRETKEY,
      region: 'us-east-1',
    });

    params.inputText = 'Just Store ' + this.toDo;
    this.messageSent = this.toDo;

    this.lex.postText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        this.lexState = data.message;
        this.messageReceived = data.message;
      }
    });
    this.toDo = null;
  }

  getQuoteCategories() {
    this.QuotationsService.getCategories().subscribe((data) => {
      if (data) {
        this.quoteCategories = data;
        this.quoteCategoriesArray = Object.keys(
          this.quoteCategories.contents.categories
        ).map((key) => ({
          reference: key,
          description: this.quoteCategories.contents.categories[key],
        }));
      }
    });
  }

  onClickQuotationCategory(value: string) {
    localStorage.setItem('selectedQuotation', value);
  }
}
