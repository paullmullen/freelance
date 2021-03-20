import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dismiss-bam',
  templateUrl: './dismiss-bam.page.html',
  styleUrls: ['./dismiss-bam.page.scss'],
})
export class DismissBamPage implements OnInit {
  constructor(public viewCtrl: ModalController) {}
  messageSent: string;
  messageReceived: string;
  public displayMessageSent;
  public displayMessageReceived;

  ngOnInit() {
    this.displayMessageSent = this.messageSent;
    this.displayMessageReceived = this.messageReceived;

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 2000);
  }
}
