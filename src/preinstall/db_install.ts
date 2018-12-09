import NeDB from 'nedb';
import * as path from 'path';
import { app } from 'electron';

const PATH_PREFIX = path.join(app.getPath('userData'), './assets/db/');
const LOGIN_DB_PATH = path.join(PATH_PREFIX, 'credential.db');
const FINANCE_DB_PATH = path.join(PATH_PREFIX, 'data.db');

export function query<T>(DBQuery: NeDB.Cursor<T>) {
  return new Promise((resolve, reject) => {
    DBQuery.exec((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

export class DataStore<T> extends NeDB {
  constructor(pathOrOptions?: string | NeDB.DataStoreOptions) {
    super(pathOrOptions);
  }
  // tslint:disable-next-line:no-shadowed-variable
  public findAsync(query: any, projection?: T): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      if (projection) {
        super.find<T>(query, projection, (err, documents) => {
          if (err) {
            reject(err);
          } else {
            resolve(documents);
          }
        });
      } else {
        super.find<T>(query, (err, documents) => {
          if (err) {
            reject(err);
          } else {
            resolve(documents);
          }
        });
      }
    });
  }

  // tslint:disable-next-line:no-shadowed-variable
  public findOneAsync(query: any, projection?: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (projection) {
        super.findOne<T>(query, projection, (err, documents) => {
          if (err) {
            reject(err);
          } else {
            resolve(documents);
          }
        });
      } else {
        super.findOne<T>(query, (err, documents) => {
          if (err) {
            reject(err);
          } else {
            resolve(documents);
          }
        });
      }
    });
  }

  public insertAsync(newDoc: T | T[]): Promise<T | T[]> {
    return new Promise<T | T[]>((resolve, reject) => {
      super.insert<T | T[]>(newDoc, (err, document) => {
        if (err) {
          reject(err);
        } else {
          resolve(document);
        }
      });
    });
  }

  public updateAsync(
    // tslint:disable-next-line:no-shadowed-variable
    query: any,
    updateQuery: any,
    options?: NeDB.UpdateOptions,
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      super.update(query, updateQuery, options, (err, numOfUpdates, upsert) => {
        if (err) {
          reject(err);
        } else {
          resolve(numOfUpdates);
        }
      });
    });
  }

  public removeAsync(
    // tslint:disable-next-line:no-shadowed-variable
    query: any,
    options?: NeDB.RemoveOptions,
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (options) {
        super.remove(query, options, (err, n) => {
          if (err) {
            reject(err);
          } else {
            resolve(n);
          }
        });
      } else {
        super.remove(query, (err, n) => {
          if (err) {
            reject(err);
          } else {
            resolve(n);
          }
        });
      }
    });
  }
}

export enum IncomeType {
  Cashier = 'cashier',
  Meituan = 'meituan',
  Cash = 'cash',
  All = 'all',
}
export interface LoginSchema {
  username: string;
  password: string;
}

export interface DataSchema {
  income: IncomeType;
  amount: number;
  date: Date;
}
export const LoginDataStore = new DataStore<LoginSchema>({
  filename: LOGIN_DB_PATH,
  autoload: true,
});

export const FinanceDataStore = new DataStore<DataSchema>({
  filename: FINANCE_DB_PATH,
  autoload: true,
});
