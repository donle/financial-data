import { Chart } from 'chart.js';

export enum DataInterval {
  Daily,
  Weekly,
  Monthly,
  Quarter,
  Year,
}

interface IDataPeriod {
  start: Date;
  end: Date;
  interval: DataInterval;
}

export class DataGenerator {
  private periods: IDataPeriod[];
  private data: Chart.ChartData | undefined;
  private options: Chart.ChartOptions | undefined;
  constructor() {
    this.periods = [];
    this.data = undefined;
    this.options = undefined;
  }

  public addPeriod(start: Date, end: Date, interval: DataInterval) {
    this.periods.push({
      start,
      end,
      interval,
    });

    return this.periods.length - 1;
  }

  public removePeriod(id: number) {
    this.periods.splice(id, 1);
  }

  public clearPeriod() {
    this.periods = [];
  }

  public generateLineChart(element: HTMLCanvasElement) {
    return new Chart(element, {
      type: 'line',
      data: this.data,
      options: this.options,
    });
  }
}
