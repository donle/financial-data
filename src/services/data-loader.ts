import { IncomeType, FinanceDataStore } from '@/utils/datastore';
import { fs, SYSTEM_PATH } from '@/utils/system';
import * as path from 'path';

export namespace DataLoader {
  export function importDefaultData() {
    const filePath = path.join(
      SYSTEM_PATH,
      './src/assets/files/default-data.enc',
    );
    if (!fs.existsSync(filePath)) {
      return;
    }

    const dataStr = fs.readFileSync(filePath, 'utf-8');
    const docs = [];
    for (const docStr of dataStr.split('\n')) {
      const [dateStr, cashier, meituan, cash] = docStr.split(',');
      const [month, day] = dateStr.split('.');
      const date = new Date(2018, Number(month) - 1, Number(day) - 1);
      docs.push({
        date,
        amount: Number(cashier),
        income: IncomeType.Cashier,
      });
      docs.push({
        date,
        amount: Number(meituan),
        income: IncomeType.Meituan,
      });
      docs.push({
        date,
        amount: Number(cash),
        income: IncomeType.Cash,
      });
    }

    return FinanceDataStore.insertAsync(docs);
  }
}
