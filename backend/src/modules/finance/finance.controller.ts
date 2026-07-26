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

    const expenseByCategory = expenses.reduce((acc: Record<string, number>, e) => {
      const key = e.category || 'Other';
      acc[key] = (acc[key] || 0) + (e.amount || 0);
      return acc;
    }, {});

    const revenue = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const receivables = invoices.reduce((s, i) => s + (i.amount - (i.paidAmount || 0)), 0);
    const payables = suppliers.reduce((s, x) => s + (x.apBalance || 0), 0);
    const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);

    return {
      ...(finance[0] || {}),
      invoiceCount: invoices.length,
      expenseTotal,
      revenue: finance[0]?.revenue ?? revenue,
      receivables: finance[0]?.receivables ?? receivables,
      payables,
      profitability,
      cashPosition: [
        { name: 'Collected', value: finance[0]?.revenue ?? revenue },
        { name: 'Receivables', value: finance[0]?.receivables ?? receivables },
        { name: 'Payables', value: payables },
        { name: 'Expenses', value: expenseTotal },
      ],
      expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      })),
      topMargins: profitability
        .slice()
        .sort((a, b) => b.margin - a.margin)
        .slice(0, 8)
        .map((p) => ({
          order: p.orderNumber,
          margin: p.margin,
        })),
    };
  }
}
