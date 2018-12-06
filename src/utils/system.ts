import { Remote } from 'electron';
import * as fsType from 'fs';
import { DataStore, LoginSchema, DataSchema } from './datastore';

interface DataStoreSet {
  LoginDataStore: DataStore<LoginSchema>;
  FinanceDataStore: DataStore<DataSchema>;
}

export const remote: Remote = window.remote;
export const fs: typeof fsType = window.fs;
export const SYSTEM_PATH: string = remote.app.getPath('userData');
export const DB: DataStoreSet = remote.getGlobal('db');
