import { ipcRenderer, remote } from 'electron';
import * as fs from 'fs';

(window as any).fs = fs;
(window as any).ipcRenderer = ipcRenderer;
(window as any).remote = remote;
