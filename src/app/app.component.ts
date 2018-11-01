import { Component, OnDestroy } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public title = 'data-analytics';

  constructor(private dataService: DataService) {}

  ngOnDestroy() {
    this.dataService.save();
  }
}
