import DataStore from 'nedb';
import { remote } from 'electron';
import { FileSystem, SaveFileType } from '../utils/file';
import { PrimarySchema, SchemaType } from '../utils/schema';

import * as path from 'path';

const userPath = remote.app.getPath('userData');

export enum IncomeType {
  Cashier = 'cashier',
  Meituan = 'meituan',
  Cash = 'cash',
  All = 'all',
}

export interface DataSchema extends PrimarySchema {
  income: Array<{ type: IncomeType; amount: SchemaType.Number }>;
  date: SchemaType.IODate;
}

export class DataLoader {
  private dataFilePath = './assets/files/data.enc';
  private dataSystem = new FileSystem<DataSchema>(this.dataFilePath);

  public importDefaultData() {
    const filePath = './assets/files/default-data.enc';
    const db = new DataStore({
      filename: path.join(userPath, filePath),
      autoload: true,
    });

    // tslint:disable-next-line:no-console
    console.log(db.getAllData());
  }

  public save(flag?: SaveFileType) {
    this.dataSystem.save(flag);
  }

  public getData(
    from: Date,
    to: Date,
    types: IncomeType | IncomeType[] = IncomeType.All,
  ) {
    if (!(types instanceof Array)) {
      types = [types];
    }

    return this.dataSystem.Schema.find({}, undefined, (doc: DataSchema) => {
      const typeMatch = (types as IncomeType[]).includes(doc.type);
      return typeMatch && doc.date >= from && doc.date <= to;
    });
  }

  private parseDate(dateStr: string) {
    const currentYear = new Date().getFullYear();
    const [month, date] = dateStr.split('.');
    return new Date(currentYear, parseInt(month, 10) - 1, parseInt(date, 10));
  }
}
