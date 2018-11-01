export namespace SchemaType {
  export type String = string;
  export type Number = number;
  export type Boolean = boolean;
  export type IODate = Date;
  export type Any = any;
}

type DocumentType =
  | SchemaType.String
  | SchemaType.Number
  | SchemaType.Boolean
  | SchemaType.IODate
  | SchemaType.Any;

interface SchemaValue {
  primary?: boolean;
  type: DocumentType;
}

export interface PrimarySchema {
  [key: string]: SchemaValue | DocumentType;
}

export class Schema<T extends PrimarySchema> {
  private data: T[];
  constructor(dataType?: T | T[]) {
    this.data = [];
    if (dataType) {
      if (dataType instanceof Array) {
        for (const d of dataType) {
        //   this.validCheck(d);
          this.data.push(d);
        }
      } else {
        // this.validCheck(dataType);
        this.data.push(dataType);
      }
    }
  }

  private validCheck(document: T) {
    for (const key of Object.keys(document)) {
      if ((document[key] as SchemaValue).primary) {
        return;
      }
    }
    throw new Error('Unexpected schema: Primary key is not found');
  }

  public get Documents() {
    return this.data;
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

  public add(documents: Schema<T> | T | T[]) {
    if (documents instanceof Array) {
      for (const d of documents) {
        // this.validCheck(d);
        this.data.push(d);
      }
    } else if (documents instanceof Schema) {
      this.data = this.data.concat(documents.Documents);
    } else {
    //   this.validCheck(documents);
      this.data.push(documents);
    }
  }

  public find(
    filter: Partial<T>,
    projection?: Array<keyof T>,
    filterFn?: (doc: T) => boolean
  ) {
    const results = filterFn
      ? this.data.filter(doc => this.findFilterFn(filter)(doc) && filterFn(doc))
      : this.data.filter(this.findFilterFn(filter));
    if (projection) {
      return results.map(this.projectionFilterFn(projection));
    } else {
      return results;
    }
  }

  public findOne(
    filter: Partial<T>,
    projection?: Array<keyof T>,
    filterFn?: (doc: T) => boolean
  ) {
    const result = filterFn
      ? this.data.find(doc => this.findFilterFn(filter)(doc) && filterFn(doc))
      : this.data.find(this.findFilterFn(filter));
    if (!result) {
      return undefined;
    } else if (projection) {
      return this.projectionFilterFn(projection)(result);
    } else {
      return result;
    }
  }

  public update(filter: Partial<T>, updates: Partial<T>) {
    const result = this.data.find(this.findFilterFn(filter));
    this.updateValues(result, updates);
  }

  public updateMany(filter: Partial<T>, updates: Partial<T>) {
    const results = this.find(filter);
    for (const result of results) {
      this.updateValues(result, updates);
    }
  }

  public remove(filter: Partial<T>) {
    const results = this.data.filter(doc => !this.findFilterFn(filter)(doc));
    this.data = results;
  }
}
