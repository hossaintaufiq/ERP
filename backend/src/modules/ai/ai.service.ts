import { Injectable } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';

@Injectable()
export class AiService {
  constructor(private readonly store: JsonFileStore) {}

  async ask(prompt: string) {
    const q = prompt.toLowerCase();

    if (q.includes('production') || q.includes("today's production")) {
      const production = await this.store.readAll<any>('production');
      const total = production.reduce((s, p) => s + (p.completedQty || 0), 0);
      return {
        intent: 'production.today',
        answer: `Current completed production across active lines is ${total.toLocaleString()} pieces across ${production.length} jobs.`,
        data: production.slice(0, 5),
      };
    }

    if (q.includes('invoice') || q.includes('pending invoice')) {
      const invoices = await this.store.readAll<any>('invoices');
      const pending = invoices.filter((i) => !['Paid'].includes(i.status));
      return {
        intent: 'finance.invoices.pending',
        answer: `There are ${pending.length} pending invoices totaling $${pending.reduce((s, i) => s + (i.amount - i.paidAmount), 0).toLocaleString()}.`,
        data: pending.slice(0, 10),
      };
    }

    if (q.includes('low stock') || q.includes('inventory')) {
      const inventory = await this.store.readAll<any>('inventory');
      const low = inventory.filter((i) => i.status !== 'In Stock');
      return {
        intent: 'inventory.low',
        answer: `${low.length} SKUs are low or critical. Top risks: ${low
          .slice(0, 3)
          .map((i) => i.name)
          .join(', ')}.`,
        data: low.slice(0, 10),
      };
    }

    if (q.includes('buyer') || q.includes('top buyer')) {
      const orders = await this.store.readAll<any>('orders');
      const map: Record<string, number> = {};
      orders.forEach((o) => {
        map[o.buyer] = (map[o.buyer] || 0) + (o.totalValue || 0);
      });
      const top = Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([buyer, value]) => ({ buyer, value }));
      return {
        intent: 'sales.top_buyers',
        answer: `Top buyer by order value is ${top[0]?.buyer} ($${top[0]?.value.toLocaleString()}).`,
        data: top,
      };
    }

    if (q.includes('attendance')) {
      const attendance = await this.store.readAll<any>('attendance');
      const present = attendance.filter((a) => a.status === 'Present').length;
      return {
        intent: 'hr.attendance',
        answer: `${present} present punches recorded in recent attendance logs.`,
        data: { present, total: attendance.length },
      };
    }

    if (q.includes('shipment')) {
      const shipments = await this.store.readAll<any>('shipments');
      const transit = shipments.filter((s) => s.status === 'In Transit');
      return {
        intent: 'logistics.shipments',
        answer: `${transit.length} containers currently in transit.`,
        data: transit.slice(0, 5),
      };
    }

    return {
      intent: 'general.help',
      answer:
        'I can help with production, pending invoices, low stock, top buyers, attendance, and shipments. Try: "Show low stock" or "Pending invoices".',
      data: null,
    };
  }
}
