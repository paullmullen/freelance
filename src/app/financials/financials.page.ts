import { Router } from '@angular/router';
import { NewMonthPage } from './new-month/new-month.page';
import { HowMuchPage } from './how-much/how-much.page';
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label, ChartsModule, BaseChartDirective } from 'ng2-charts';
import { IonReorderGroup, ModalController, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UtteranceService } from './../bam/utterance.service';
import { Utterance } from './../bam/utterance.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EditPage } from './../my-stuff/edit/edit.page';


@Component({
  selector: 'app-financials',
  templateUrl: './financials.page.html',
  styleUrls: ['./financials.page.scss'],
})
export class FinancialsPage implements OnInit, OnDestroy {
  constructor(
    private UtteranceService: UtteranceService,
    public modalController: ModalController,
    private router: Router
  ) {}

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  isLoading = false;
  private UtteranceSub: Subscription;
  loadedUtterances: Utterance[];
  filteredUtterances: Utterance[];
  listedLoadedUtterances: Utterance[];
  displayData: any;
  private usersUid: string;
  private today: Date;
  private thisMonth: number;
  private thisYear: number;
  private offerToArchive: boolean;

  showDetailStatus = 'All';
  invoicedAmount = 0;
  forecastAmount = 0;
  receivedAmount = 0;

  public barChartPlugins = [ChartDataLabels];
  barChartData: ChartDataSets[];
  barChartLabels: Label[] = [''];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'start',
        color: 'white',
        padding: 5,
        font: {
          size: 10,
        },
      },
    },
  };

  ngOnInit() {
    this.today = new Date();
    this.thisMonth = 6; // this.today.getMonth();
    this.thisYear = this.today.getFullYear();
    this.offerToArchive = false;

    // since this module could open multiple modals, start by assuming that none are open.
    // the localStorage 'modalOpen' is set when a modal opens inside the modals.
    localStorage.removeItem('modalOpen');


    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
    try {
      if (!JSON.parse(localStorage.getItem('monthlyGoal'))) {
        localStorage.setItem('monthlyGoal', '1000');
      }
    } catch {
      localStorage.setItem('monthlyGoal', '1000');
    }
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        try {
          if (Utterances) {
            // this is all of the utterances in the database.  Holding on to that for future team collab.
            this.loadedUtterances = Utterances;
            // for now, filter just to those utterances that go with this user.
            this.sortItems('project', 'asc');
            this.sortItems('importance', 'dec');
            this.sortItems('urgency', 'dec');
            this.listedLoadedUtterances = this.loadedUtterances.filter(
              (utter) =>
                utter.user === this.usersUid &&
                (utter.project === 'Forecast' ||
                  utter.project === 'Invoiced' ||
                  utter.project === 'Received') &&
                  !utter.archived
            );
          }

          // group the items by project prior to display
          const getData = this.groupMethod(
            this.listedLoadedUtterances,
            'project'
          );
          // now check to see if any of the items should be archived.
          // algorithm is to find the received date, check to see if it was last month or
          // before.  If there is such an item, then in ion-view-did-enter, we will put up
          // a modal to see if they want to archive the older data.

          if (!localStorage.getItem('modalOpen')) {  // there is a chance this modal is already open.  Only do it if it's not already open
          for (const item of this.listedLoadedUtterances) {
            if (item.received && !item.archived) {
              if (
                (this.thisYear === new Date(item.received).getFullYear() &&
                  this.thisMonth > new Date(item.received).getMonth() + 1) ||
                this.thisYear > new Date(item.received).getFullYear() // takes care of Jan < Dec
              ) {
                // If you get here, then the item was received before the start of the current month.
                this.offerToArchive = true;
              }
            }
          }

          // been through the whole list... so now if we found any to archive, we do it now.
          if (this.offerToArchive === true) {
            this.archiveReceipts();
          }

        }

          // iterate through the entries, add a project title for each group (invoiced, received,
          // forecast) if there is at least one entry of that type in the list of entries.
          this.displayData = Object.entries(getData);
          let addInvoiced = true;
          let addForecast = true;
          let addReceived = true;

          for (let index = 0; index < this.displayData.length; index++) {
            if (this.displayData[index][0].indexOf('Invoiced') > -1) {
              addInvoiced = false;
            }
            if (this.displayData[index][0].indexOf('Received') > -1) {
              addReceived = false;
            }
            if (this.displayData[index][0].indexOf('Forecast') > -1) {
              addForecast = false;
            }
          }
          if (addInvoiced) {
            this.displayData.push([
              'Invoiced',
              [
                {
                  complete: false,
                  id: null,
                  importance: null,
                  isFinancials: true,
                  project: 'Invoiced',
                  tag: null,
                  urgency: null,
                  user: null,
                  utterance: null,
                },
              ],
            ]);
          }
          if (addForecast) {
            this.displayData.push([
              'Forecast',
              [
                {
                  complete: false,
                  id: null,
                  importance: null,
                  isFinancials: true,
                  project: 'Forecast',
                  tag: null,
                  urgency: null,
                  user: null,
                  utterance: null,
                },
              ],
            ]);
          }
          if (addReceived) {
            this.displayData.push([
              'Received',
              [
                {
                  complete: false,
                  id: null,
                  importance: null,
                  isFinancials: true,
                  project: 'Received',
                  tag: null,
                  urgency: null,
                  user: null,
                  utterance: null,
                },
              ],
            ]);
          }
        } catch (error) {
          console.log('Error in ngOnInit in my-stuff.page.ts ', error);
        }
      }
    );
  }

  groupMethod(array, fn) {
    if (array) {
      return array.reduce((acc, current) => {
        const groupName = typeof fn === 'string' ? current[fn] : fn(current);
        (acc[groupName] = acc[groupName] || []).push(current);
        return acc;
      }, {});
    }
  }

  sortItems(prop, order) {
    this.invoicedAmount = 0;
    this.forecastAmount = 0;
    this.receivedAmount = 0;

    this.loadedUtterances.sort((a, b) => {
      if (order === 'asc') {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    // recalculate the amount of each category for the graph
    this.loadedUtterances.forEach((item) => {
      if (item.project === 'Invoiced' && !item.archived && item.amount && item.user === this.usersUid) {
        this.invoicedAmount += item.amount;
      }
      if (item.project === 'Forecast' && !item.archived && item.amount && item.user === this.usersUid) {
        this.forecastAmount += item.amount;
      }
      if (item.project === 'Received' && !item.archived && item.amount && item.user === this.usersUid) {
        this.receivedAmount += item.amount;
      }
    });

    // draw the chart
    this.barChartData = [
      {
        data: [JSON.parse(localStorage.getItem('monthlyGoal'))],
        stack: '2',
        backgroundColor: 'rgb(190,190,190)',
        barThickness: 10,
      },
      {
        data: [this.forecastAmount],
        stack: '1',
        backgroundColor: 'rgb(0,0,200)',
        barThickness: 50,
      },
      {
        data: [this.invoicedAmount],
        stack: '1',
        backgroundColor: 'rgb(0,175,250)',
        barThickness: 50,
      },
      {
        data: [this.receivedAmount],
        stack: '1',
        backgroundColor: 'rgb(0,200,100)',
        barThickness: 50,
      },
    ];

  }


  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe((utts) => {
      this.isLoading = false;
    });
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.UtteranceSub) {
      this.UtteranceSub.unsubscribe();
    }
  }

  reorder(event) {
    this.UtteranceService.updateProject(
      this.findItemIdForEvent(event.detail.from),
      this.findProjectForEvent(event.detail.to)
    );
    this.sortItems('project', 'asc');

    event.detail.complete();
  }

  findProjectForEvent(location: number) {
    // number is the position in a list of ion-items
    // this list is segmented into subgroups and the subgroup headers are also elements in the list
    // so we have to find into which subgroup the item has been dropped.
    // displayData[][0] holds the project name
    // displayData[][1] holds the individual elements in the project.

    let i = 0;
    let index = 0;
    while (i < this.displayData.length) {
      index += this.displayData[i][1].length + 1;
      if (index > location) {
        return this.displayData[i][0];
      }
      i++;
    }

    console.log('Something went wrong finding project for reordered item.');
    return '';
  }

  findItemIdForEvent(location: number) {
    // number is the position in a list of ion-items
    // this list is segmented into subgroups and the subgroup headers are also elements in the list
    // so we have to find into which subgroup the item has been dropped.
    // displayData[][0] holds the project name
    // displayData[][1] holds the individual elements in the project.

    let i = 0;
    let index = 0;
    let previousIndex = 0;
    while (i < this.displayData.length) {
      // find the right subgroup
      index += this.displayData[i][1].length + 1;
      if (index > location) {
        // now I'm in the right subgroup
        return this.displayData[i][1][location - previousIndex - 1].id;
      }
      // on the Successful loop in While, index will be greater than the position of
      // the item we're looking for, so keep track of where we were
      previousIndex = index;
      i++;
    }

    console.log('Something went wrong finding ItemId for reordered item.');
    return '';
  }

  onClickChart() {
    this.openModal('updateGoal');
  }

  onEditAmount(id: string) {
    this.openModal(id);
  }

  onEditItem(id: string, slidingEl: IonItemSliding) {
    {
      slidingEl.close();

      this.modalController
        .create({
          component: EditPage,
          componentProps: {
            utteranceId: id,
          },
        })
        .then((modalEl) => {
          modalEl.present();
        });
      return;
    }
  }

  async archiveReceipts() {
      const modal = await this.modalController.create({
      component: NewMonthPage,
      componentProps: {
        utteranceId: null
      },
      cssClass: 'small-modal-css',
    });
    return await modal.present();
  }

  async openModal(id: string) {
    const modal = await this.modalController.create({
      component: HowMuchPage,
      componentProps: {
        utteranceId: id,
      },
      cssClass: 'small-modal-css',
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        dataReturned = dataReturned.data;
        this.barChartData = [
          {
            data: [JSON.parse(localStorage.getItem('monthlyGoal'))],
            stack: '2',
            backgroundColor: 'rgb(190,190,190)',
            barThickness: 10,
          },
          {
            data: [this.forecastAmount],
            stack: '1',
            backgroundColor: 'rgb(0,0,200)',
            barThickness: 50,
          },
          {
            data: [this.invoicedAmount],
            stack: '1',
            backgroundColor: 'rgb(0,175,250)',
            barThickness: 50,
          },
          {
            data: [this.receivedAmount],
            stack: '1',
            backgroundColor: 'rgb(0,200,100)',
            barThickness: 50,
          },
        ];

        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }
}
