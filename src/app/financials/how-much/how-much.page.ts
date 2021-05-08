import { UtteranceService } from './../../bam/utterance.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-my-modal',
  templateUrl: './how-much.page.html',
  styleUrls: ['./how-much.page.scss'],
})
export class HowMuchPage implements OnInit {
  utteranceId: string;
  promptString: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private UtteranceService: UtteranceService
  ) {}

  ngOnInit() {
    this.utteranceId = this.navParams.data.utteranceId;
    if (this.utteranceId === 'updateGoal') {
      this.promptString = 'New monthly goal?';
    } else {
      this.promptString = 'Billing amount?';
    }
  }

  closeModal(form: NgForm) {
    if ((this.utteranceId === 'updateGoal')) {
      localStorage.setItem('monthlyGoal', form.value.amount);
      this.modalController.dismiss(close);
    } else {
      this.UtteranceService.updateAmount(this.utteranceId, form.value.amount);
      this.modalController.dismiss(close);
    }
  }
}
