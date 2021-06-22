import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label, ChartsModule, BaseChartDirective } from 'ng2-charts';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UtteranceService } from './../bam/utterance.service';
import { Utterance } from './../bam/utterance.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  constructor(
    private UtteranceService: UtteranceService,
    public modalController: ModalController,
    private router: Router
  ) {}

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective;

  // Local Variables
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
        if (Utterances) {
          // this is all of the utterances in the database.  Holding on to that for future team collab.
          this.loadedUtterances = Utterances;
          this.listedLoadedUtterances = this.loadedUtterances.filter(
            (item) =>
              (item.project === 'Invoiced' ||
                item.project === 'Forecast' ||
                item.project === 'Received') &&
              !item.archived
          );
          // recalculate the amount of each category for the graph
          this.listedLoadedUtterances.forEach((item) => {
            if (item.project === 'Invoiced' && !item.archived) {
              this.invoicedAmount += item.amount;
            }
            if (item.project === 'Forecast' && !item.archived) {
              this.forecastAmount += item.amount;
            }
            if (item.project === 'Received' && !item.archived) {
              this.receivedAmount += item.amount;
            }
          });
          // now filter to only those that are urgent or important and not complete and not archived.
          this.listedLoadedUtterances = this.loadedUtterances.filter(
            (utter) =>
              utter.user === this.usersUid &&
              (utter.importance || utter.urgency) &&
              !utter.archived &&
              !utter.complete && !utter.isFinancials
          );
          this.displayData = this.listedLoadedUtterances;
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
      }
    );
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe((utts) => {
      this.isLoading = false;
    });
  }
}

