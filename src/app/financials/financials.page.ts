import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-financials',
  templateUrl: './financials.page.html',
  styleUrls: ['./financials.page.scss'],
})
export class FinancialsPage implements OnInit {
  constructor() {}

  @ViewChild('barChart') barChart;
  private bars: any;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.createBarChart();
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        datasets: [
          {
            data: [300],
            backgroundColor: 'rgb(0,150,255)', // array should have same number of elements as number of dataset
            barThickness: 10,
          },
          {
            data: [1000],
            backgroundColor: 'rgb(0,0,255)', // array should have same number of elements as number of dataset
            barThickness: 10,
          },
          {
            data: [800],
            backgroundColor: 'rgb(0,200,0)', // array should have same number of elements as number of dataset
            barThickness: 10,
          },
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
                display: true,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
              },
              stacked: true,
            },
          ],
        },
        // plugins: [
        //   {
        //     annotation: {
        //       annotations: [
        //         {
        //           type: 'line',
        //           mode: 'vertical',
        //           scaleID: 'x-axis-0',
        //           value: 2000,
        //           borderColor: 'rgb(75, 192, 192)',
        //           borderWidth: 4,
        //           label: {
        //             enabled: true,
        //             content: '2000',
        //           },
        //         },
        //       ],
        //     },
        //   },
        // ],
      },
    });
  }
}
