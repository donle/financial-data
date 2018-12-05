import * as fs from 'fs';
import { Remote, IpcRenderer } from 'electron';
import NeDB from 'nedb';
import { DataStore, LoginSchema, DataSchema } from './utils/datastore';

declare global {
  interface Window {
    fs: typeof fs;
    remote: Remote;
    ipcRenderer: IpcRenderer;
  }

  export interface db {
    LoginDataStore: DataStore<LoginSchema>;
    FinanceDataStore: DataStore<DataSchema>;
  }
}
