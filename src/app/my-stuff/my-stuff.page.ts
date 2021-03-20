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


  private TagSub: Subscription;
  loadedTags: TagData[];

  private bars: any;
  private colorArray: any;


  constructor(
    private UtteranceService: UtteranceService,
    private TagService: TagService,
    private modalController: ModalController
  ) {}

  @ViewChild('barChart') barChart;

  ngOnInit() {
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        this.loadedUtterances = Utterances;
        this.listedLoadedUtterances = this.loadedUtterances;
      }
    );
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
    this.totalUtterances = this.UtteranceService.utteranceCount;
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
  }

  ionViewDidEnter() {
    console.log(this.listedLoadedUtterances.length);
    // this.createBarChart();
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

  onFilterUpdate(event: any) {
    if (event.detail.value === 'all') {
      this.filteredUtterances = this.loadedUtterances;
      this.listedLoadedUtterances = this.filteredUtterances;
    } else if (event.detail.value === 'tagged') {
      this.filteredUtterances = this.loadedUtterances.filter(
        (utter) => utter.tag.length > 0
      );
      this.listedLoadedUtterances = this.filteredUtterances;
    } else {
      this.filteredUtterances = this.loadedUtterances.filter(
        (utter) => utter.tag.length === 0
      );
      this.listedLoadedUtterances = this.filteredUtterances;
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

  // createBarChart() {
  //   this.bars = new Chart(this.barChart.nativeElement, {
  //     type: 'horizontalBar',
  //     data: {
  //       datasets: [

  //           {
  //           data: [this.totalUtterances],
  //           backgroundColor: 'rgb(56, 128, 256)', // array should have same number of elements as number of dataset
  //           barThickness: 10
  //           },
  //           {
  //           data: [100],
  //           backgroundColor: 'rgb(150,200,255)', // array should have same number of elements as number of dataset
  //           barThickness: 10
  //           }

  //       ]
  //     },
  //     options: {
  //       legend: {
  //         display: false,
  //       },
  //       scales: {
  //         xAxes: [
  //           {
  //             gridLines: {
  //               display: false,
  //             },
  //             stacked: true,

  //             ticks: {
  //               suggestedMax: 400,
  //               display: false
  //             }
  //           },
  //         ],
  //         yAxes: [
  //           {
  //             gridLines: {
  //               display: false,
  //             },
  //             stacked: true,
  //           },
  //         ],
  //       },
  //     },
  //   });
  // }
}
