import { UtteranceService } from './../../bam/utterance.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Utterance } from './/../../bam/utterance.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-month',
  templateUrl: './new-month.page.html',
  styleUrls: ['./new-month.page.scss'],
})
export class NewMonthPage implements OnInit, OnDestroy {
  constructor(
    private modalController: ModalController,
    private UtteranceService: UtteranceService,
    public router: Router
  ) {}

  private UtteranceSub: Subscription;
  private loadedUtterances: Utterance[];
  private listedLoadedUtterances: Utterance[];
  private today: Date;
  private thisMonth: number;
  private thisYear: number;

  ngOnInit() {
    localStorage.setItem('modalOpen', 'true');
  }

  onNotNow() {
    this.modalController.dismiss(close);
  }

  onDoIt() {
    this.today = new Date();
    this.thisMonth = this.today.getMonth();
    this.thisYear = this.today.getFullYear();
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        if (Utterances) {
          // this is all of the utterances in the database.  Holding on to that for future team collab.
          this.loadedUtterances = Utterances;

          // Now filter to those utterances that are archive ready.
          this.listedLoadedUtterances = this.loadedUtterances.filter(
            (utter) =>
              utter.received &&
              !utter.archived  &&
              (
                (
                  (this.thisYear === new Date(utter.received).getFullYear()) &&
                  (this.thisMonth > new Date(utter.received).getMonth())
                )

               ||

                this.thisYear > new Date(utter.received).getFullYear()  // takes care of Jan < Dec
              )
          );
          // for each item, now archive it.
          this.listedLoadedUtterances.forEach((element) => {

            this.UtteranceService.archive(element.id, Date());
          });
        }
      }
    );
    this.UtteranceSub.unsubscribe();
    this.modalController.dismiss(close);
    this.router.navigate(['my-stuff']);

  }

  ngOnDestroy() {
    localStorage.removeItem('modalOpen');

  }
}
