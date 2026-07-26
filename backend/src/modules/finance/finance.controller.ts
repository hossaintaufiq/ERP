import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JsonFileStore } from '../../common/storage/json-file.store';

@ApiTags('finance')
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly store: JsonFileStore) {}

  @Get('summary')
  async summary() {
    const [finance, invoices, expenses, suppliers, orders] = await Promise.all([
      this.store.readAll<any>('finance'),
      this.store.readAll<any>('invoices'),
      this.store.readAll<any>('expenses'),
      this.store.readAll<any>('suppliers'),
      this.store.readAll<any>('orders'),
    ]);

    const profitability = orders.slice(0, 20).map((o) => ({
      orderNumber: o.orderNumber,
      buyer: o.buyer,
      revenue: o.totalValue,
      estimatedCost: Math.round(o.totalValue * 0.72),
      margin: Math.round(o.totalValue * 0.28),
      marginPct: 28,
    }));

    return {
      ...(finance[0] || {}),
      invoiceCount: invoices.length,
      expenseTotal: expenses.reduce((s, e) => s + e.amount, 0),
      payables: suppliers.reduce((s, x) => s + (x.apBalance || 0), 0),
      profitability,
    };
  }
}
