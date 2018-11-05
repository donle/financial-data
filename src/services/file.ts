import * as crypto from 'crypto';
import * as fs from 'fs';
import { Schema, PrimarySchema } from './schema';

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

export type SaveFileType = 'trunc' | 'append';

export class File<T extends PrimarySchema> {
  constructor(private filePath: string) {}

  fecth() {
    const text = fs.existsSync(this.filePath)
      ? decrypt(fs.readFileSync(this.filePath, 'utf-8'))
      : '';
    return new Schema<T>(JSON.parse(text) as T[]);
  }

  save(text: Array<T> | Schema<T>, flag: SaveFileType = 'trunc') {
    if (text instanceof Schema) {
      text = text.Documents;
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

export class FileSystem<T extends PrimarySchema> {
  private system: File<T>;
  private schemaDocuments: Schema<T>;

  constructor(private filepath: string) {
    this.system = new File<T>(this.filepath);
    this.schemaDocuments = this.system.fecth();
  }

  public isEmpty() {
    return this.schemaDocuments.Documents.length === 0;
  }

  public get System() {
    return this.system;
  }

  public get Schema() {
    return this.schemaDocuments;
  }

  public save(flag?: SaveFileType) {
    this.system.save(this.schemaDocuments, flag);
  }
}
