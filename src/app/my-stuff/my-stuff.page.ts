import { SegmentChangeEventDetail } from '@ionic/core';
import { TagUtterancesPage } from './tag-utterances/tag-utterances.page';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

import { UtteranceService } from '../folder/utterance.service';
import { Utterance } from './../folder/utterance.model';

import { TagData } from './tag-utterances/tag.model';
import { TagService } from './tag-utterances/tag.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

@Component({
  selector: 'app-my-stuff',
  templateUrl: './my-stuff.page.html',
  styleUrls: ['./my-stuff.page.scss'],
})
export class MyStuffPage implements OnInit, OnDestroy {
  isLoading = false;

  private UtteranceSub: Subscription;
  loadedUtterances: Utterance[];
  filteredUtterances: Utterance[];
  listedLoadedUtterances: Utterance[];
  totalUtterances: number;
  private usersUid: string;

  private TagSub: Subscription;
  loadedTags: TagData[];

  private bars: any;
  private colorArray: any;
  private showDetailStatus = 'All';
  private showCompletedStatus = false;

  constructor(
    private UtteranceService: UtteranceService,
    private TagService: TagService,
    private modalController: ModalController
  ) {}

  @ViewChild('barChart') barChart;

  ngOnInit() {
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        try {
          if (Utterances) {
            // this is all of the utterances in the database.  Holding on to that for future team collab.
            this.loadedUtterances = Utterances;
            // for now, filter just to those utterances that go with this user.
            this.listedLoadedUtterances = this.loadedUtterances.filter(
              (utter) => utter.user === this.usersUid
            );
          }
        } catch (error) {
          console.log('Error in ngOnInit in my-stuff.page.ts ', error);
        }
      }
    );
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe(() => {
      this.isLoading = false;
    });
    this.isLoading = true;
    this.TagService.getTags().subscribe(() => {
      this.isLoading = false;
    });
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
  }

  ionViewDidEnter() {
    this.totalUtterances = this.loadedUtterances.length;
    this.createBarChart();
  }

  ngOnDestroy() {
    if (this.UtteranceSub) {
      this.UtteranceSub.unsubscribe();
    }
    if (this.TagSub) {
      this.TagSub.unsubscribe();
    }
  }

  async onTagUtterance(
    id: string,
    tag: string,
    utterance: string,
    slidingEl: IonItemSliding
  ) {
    slidingEl.close();

    this.modalController
      .create({
        component: TagUtterancesPage,
        componentProps: {
          utteranceId: id,
          utteranceString: utterance,
        },
        swipeToClose: true,
        showBackdrop: true,
      })
      .then((modalEl) => {
        modalEl.present();
      });
    return;
  }

  async onMarkComplete(id: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.UtteranceService.markComplete(id);

    return;
  }

  onFilterUpdate(event: any) {
    if (event.detail.value === 'toggleChanged') {
      // then the Completed Items toggle was changed
      if (event.detail.checked) {
        this.showCompletedStatus = true;
      } else {
        this.showCompletedStatus = false;
      }
    } else {
      this.showDetailStatus = event.detail.value;
    }
    try {
      if (this.showCompletedStatus === true) {
        // show all items
        if (this.showDetailStatus === 'all') {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) => utter.user === this.usersUid
          );
        } else if (this.showDetailStatus === 'tagged') {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) => utter.tag.length > 0 && utter.user === this.usersUid
          );
        } else {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) => utter.tag.length === 0 && utter.user === this.usersUid
          );
        }
      } else {
        // only show non-completed items
        if (this.showDetailStatus === 'all') {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) => utter.user === this.usersUid && utter.complete === false
          );
        } else if (this.showDetailStatus === 'tagged') {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) =>
              utter.tag.length > 0 &&
              utter.user === this.usersUid &&
              utter.complete === false
          );
        } else {
          this.filteredUtterances = this.loadedUtterances.filter(
            (utter) =>
              utter.tag.length === 0 &&
              utter.user === this.usersUid &&
              utter.complete === false
          );
        }
      }
      this.listedLoadedUtterances = this.filteredUtterances;
    } catch (error) {
      console.log('Error in onFilterUpdate in my-stuffpage.ts', error);
    }
  }

  getIconForTag(tagText: string) {
    try {
      const iconName = this.loadedTags.find((t) => t.tagText === tagText).icon;
      return iconName + '-outline';
    } catch {
      return '';
    }
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'horizontalBar',
      data: {
        datasets: [
          {
            data: [this.totalUtterances],
            backgroundColor: 'rgb(56, 128, 256)', // array should have same number of elements as number of dataset
            barThickness: 10,
          },
          // {
          // data: [100],
          // backgroundColor: 'rgb(150,200,255)', // array should have same number of elements as number of dataset
          // barThickness: 10
          // }
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              stacked: true,

              ticks: {
                suggestedMax: 500,
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              stacked: true,
            },
          ],
        },
      },
    });
  }
}
