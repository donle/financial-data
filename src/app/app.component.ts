import { Component, OnDestroy } from '@angular/core';
import { DataService } from './services/data.service';
import { DataLoader } from 'src/utils/data-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public title = 'data-analytics';

  constructor(private dataService: DataService) {
    const dataLoader = new DataLoader();
    dataLoader.importDefaultData();
  }

  ngOnDestroy() {
    this.dataService.save();
  }
}
