import { DecimalPipe } from '@angular/common';
import { UtteranceService } from './../../bam/utterance.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-my-modal',
  templateUrl: './how-much.page.html',
  styleUrls: ['./how-much.page.scss'],
})
export class HowMuchPage implements OnInit {


  utteranceId: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private UtteranceService: UtteranceService
  ) { }

  ngOnInit() {
    this.utteranceId = this.navParams.data.utteranceId;
  }

  closeModal(form: NgForm) {
    this.UtteranceService.updateAmount(this.utteranceId, form.value.amount);
    this.modalController.dismiss(close);
  }

}
