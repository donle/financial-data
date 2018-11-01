import * as CsvToJson from 'csvtojson/v2';
import { FileSystem, SaveFileType } from 'src/services/file';
import { PrimarySchema, SchemaType } from 'src/services/schema';

export enum IncomeType {
  Cashier,
  Meituan,
  Cash,
  All
}

export interface DataSchema extends PrimarySchema {
  type: IncomeType;
  amount: SchemaType.Number;
  date: SchemaType.IODate;
}

export class DataLoader {
  private dataFilePath = 'src/assets/files/data.enc';
  private dataSystem = new FileSystem<DataSchema>(this.dataFilePath);
  constructor() {}

  public importDefaultData() {
    const filePath = 'src/assets/files/default-data.enc';
    CsvToJson()
      .fromFile(filePath)
      .subscribe((values: DataSchema[], lineNumber: number) => {
        this.dataSystem.Schema.add(values);
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
