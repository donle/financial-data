import { Remote } from 'electron';
import * as fsType from 'fs';
console.log((global as any).db);
export const remote: Remote = window.remote;
export const fs: typeof fsType = window.fs;
export const SYSTEM_PATH: string = remote.app.getPath('userData');
export const DB = (global as any).db;
