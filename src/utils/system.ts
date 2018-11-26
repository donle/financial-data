import * as fsType from 'fs';
import { Remote } from 'electron';

export const remote: Remote = window.remote;
export const fs: typeof fsType = window.fs;
export const SYSTEM_PATH: string = remote.app.getPath('userData');
