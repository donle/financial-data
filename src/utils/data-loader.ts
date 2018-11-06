import * as CsvToJson from 'csvtojson/v2';
import { FileSystem, SaveFileType } from 'src/services/file';
import { PrimarySchema, SchemaType } from 'src/services/schema';

export enum IncomeType {
  Cashier = 'cashier',
  Meituan = 'meituan',
  Cash = 'cash',
  All = 'all'
}

export interface DataSchema extends PrimarySchema {
  income: { type: IncomeType, amount: SchemaType.Number }[];
  date: SchemaType.IODate;
}

export class DataLoader {
  private dataFilePath = 'src/assets/files/data.enc';
  private dataSystem = new FileSystem<DataSchema>(this.dataFilePath);
  constructor() {}

  private parseDate(dateStr: string) {
    const currentYear = new Date().getFullYear();
    const [month, date] = dateStr.split('.');
    return new Date(currentYear, parseInt(month, 10) - 1, parseInt(date, 10));
  }

  public importDefaultData() {
    const filePath = 'src/assets/files/default-data.enc';
    CsvToJson()
      .fromFile(filePath)
      .subscribe((values: any[], lineNumber: number) => {
        for (const document of values) {
          const date = this.parseDate(document.date);
          this.dataSystem.Schema.add({
            date,
            income: [
              {
                type: IncomeType.Cashier,
                amount: document.cashier,
              },
              {
                type: IncomeType.Meituan,
                amount: document.meituan,
              },
              {
                type: IncomeType.Cash,
                amount: document.cash,
              },
            ]
          });
        }
        this.dataSystem.save();
      });
  }

  public save(flag?: SaveFileType) {
    this.dataSystem.save(flag);
  }

  public getData(
    from: Date,
    to: Date,
    types: IncomeType | IncomeType[] = IncomeType.All
  ) {
    if (!(types instanceof Array)) {
      types = [types];
    }

    return this.dataSystem.Schema.find({}, null, (doc: DataSchema) => {
      const typeMatch = (types as IncomeType[]).includes(doc.type);
      return typeMatch && doc.date >= from && doc.date <= to;
    });
  }
}
