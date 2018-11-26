import * as fs from 'fs';
import { Remote } from 'electron';

declare global {
    interface Window {
        fs: typeof fs;
        remote: Remote;
    }
}
