import { Chart } from 'chart.js';
import { ElementRef } from '@angular/core';
import { IncomeType } from '../utils/data-loader';

export enum DataInterval {
  Daily,
  Weekly,
  Monthly,
  Quarter,
  Year
}

interface IDataPeriod {
  start: Date;
  end: Date;
  interval: DataInterval;
}

export class DataGenerator {
  private periods: IDataPeriod[];
  private data: any;
  private options: Chart.ChartOptions;
  constructor() {
    this.periods = [];
  }

  public addPeriod(start: Date, end: Date, interval: DataInterval) {
    this.periods.push({
      start,
      end,
      interval
    });

    return this.periods.length - 1;
  }

  public removePeriod(id: number) {
    this.periods.splice(id, 1);
  }

  public clearPeriod() {
    this.periods = [];
  }

  public generateLineChart(element: ElementRef) {
    return new Chart(element.nativeElement, {
      type: 'line',
      data: this.data,
      options: this.options
    });
  }
}
