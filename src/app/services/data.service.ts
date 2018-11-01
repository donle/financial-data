import { Injectable } from '@angular/core';
import { DataLoader } from 'src/utils/data-loader';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataLoader = new DataLoader();
  constructor() {
    this.dataLoader.importDefaultData();
  }

  save() {
    this.dataLoader.save();
  }
}
