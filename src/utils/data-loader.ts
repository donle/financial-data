export enum IncomeType {
    Cashier,
    Meituan,
    Cash,
    All,
}

export class DataLoader {
    constructor () {}

    public static importDataFromCSVFile () {

    }

    public getData(from: Date, to: Date, types: IncomeType | IncomeType[] = IncomeType.All) {
        if (!(types instanceof Array)) {
            types = [types];
        }
    }
}
