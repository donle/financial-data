import * as crypto from 'crypto';
import * as fs from 'fs';

const algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


function encrypt(text: string) {
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text: string) {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
export class JsonFile<T> {
    private jsonFile: T[];
    constructor(
        private json: string
    ) {
        this.jsonFile = JSON.parse(this.json) as T[];
    }

    private findFilterFn(filter: Partial<T>) {
        return (document: T) => {
            const keys = Object.keys(filter);
            let match = true;
            for (const key of keys) {
                if (document[key] !== filter[key]) {
                    match = false;
                    break;
                }
            }
            return match;
        };
    }

    private projectionFilterFn(projection: Array<keyof T>) {
        return (document: T) => {
            const result: Partial<T> = {};
            for (const key of projection) {
                result[key] = document[key];
            }
            return result;
        };
    }

    private updateValues(document: Partial<T>, updates: Partial<T>) {
        for (const key of Object.keys(updates)) {
            document[key] = updates[key];
        }
    }

    public toJson() {
        return this.jsonFile;
    }

    public add(documents: T | T[]) {
        if (documents instanceof Array) {
            for (const d of documents) {
                this.jsonFile.push(d);
            }
        } else {
            this.jsonFile.push(documents);
        }
    }

    public find(filter: Partial<T>, projection?: Array<keyof T>, filterFn?: (doc: T) => boolean) {
        const results = filterFn
        ? this.jsonFile.filter(doc => this.findFilterFn(filter)(doc) && filterFn(doc))
        : this.jsonFile.filter(this.findFilterFn(filter));
        if (projection) {
            return results.map(this.projectionFilterFn(projection));
        } else {
            return results;
        }
    }

    public findOne(filter: Partial<T>, projection?: Array<keyof T>, filterFn?: (doc: T) => boolean) {
        const result = filterFn
        ? this.jsonFile.find(doc => this.findFilterFn(filter)(doc) && filterFn(doc))
        : this.jsonFile.find(this.findFilterFn(filter));
        if (!result) {
            return undefined;
        } else if (projection) {
            return this.projectionFilterFn(projection)(result);
        } else {
            return result;
        }
    }

    public update(filter: Partial<T>, updates: Partial<T>) {
        const result = this.jsonFile.find(this.findFilterFn(filter));
        this.updateValues(result, updates);
    }

    public updateMany(filter: Partial<T>, updates: Partial<T>) {
        const results = this.find(filter);
        for (const result of results) {
            this.updateValues(result, updates);
        }
    }

    public remove(filter: Partial<T>) {
        const results = this.jsonFile.filter(doc => !this.findFilterFn(filter)(doc));
        this.jsonFile = results;
    }
}

type SaveFileType = 'trunc' | 'append';

export class File<T> {
    constructor(
        private filePath: string
    ) { }

    fecth() {
        const text = decrypt(fs.readFileSync(this.filePath, 'utf-8'));
        return new JsonFile<T>(text);
    }

    save(text: Array<T> | JsonFile<T>, flag: SaveFileType = 'trunc') {
        if (text instanceof JsonFile) {
            text = text.toJson();
        }

        const encText = encrypt(JSON.stringify(text));
        switch (flag) {
            case 'trunc':
                fs.writeFileSync(this.filePath, encText, 'utf-8');
                break;
            case 'append':
                fs.appendFileSync(this.filePath, encText, 'utf-8');
                break;
            default:
                throw new TypeError();
        }
    }
}

export class FileSystem<T> {
    public system: File<T>;
    public jsonData: JsonFile<T>;

    constructor(private filepath: string) {
        this.system = new File<T>(this.filepath);
        this.jsonData = this.system.fecth();
    }

    public get System() {
        return this.system;
    }

    public get Data() {
        return this.jsonData;
    }

    public save() {
        this.system.save(this.jsonData);
    }
}
