import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label, ChartsModule } from 'ng2-charts';



@Component({
  selector: 'app-financials',
  templateUrl: './financials.page.html',
  styleUrls: ['./financials.page.scss'],
})
export class FinancialsPage implements OnInit {
  constructor() {}


  barChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          display: false,
        },
      }],
      xAxes: [{
        id: 'x0',
        ticks: {
          beginAtZero: true,
          max: 3000,
        },
        gridLines: {
          display: false,
        },
      }],
    },

  };
  barChartLabels: Label[] = [''];
  barChartType: ChartType = 'horizontalBar';
  barChartPlugins = [];
  barChartLegend = false;
  barChartData: ChartDataSets[] = [
    { data: [2450], stack: '2', label: 'Goal', backgroundColor: 'rgb(190,190,190)', barThickness: 10 },
    { data: [450], stack: '1', label: 'Forecast', backgroundColor: 'rgb(0,0,200)', barThickness: 50 },
    { data: [750], stack: '1', label: 'Invoiced', backgroundColor: 'rgb(0,175,250)', barThickness: 50  },
    { data: [250], stack: '1', label: 'Received', backgroundColor: 'rgb(0,255,100)', barThickness: 50 },
  ];




  ngOnInit() {}

  ionViewWillEnter() {}

}
