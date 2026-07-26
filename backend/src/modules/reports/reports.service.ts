import { Injectable } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';

@Injectable()
export class ReportsService {
  constructor(private readonly store: JsonFileStore) {}

  async generate(type: string, timeline: string = 'Monthly') {
    const map: Record<string, string> = {
      production: 'production',
      inventory: 'inventory',
      sales: 'orders',
      finance: 'invoices',
      payroll: 'payroll',
      attendance: 'attendance',
      shipment: 'shipments',
      quality: 'qc',
      purchase: 'purchase-orders',
      machine: 'machines',
    };
    const collection = map[type] || 'orders';
    const rows = await this.store.readAll<any>(collection);

    return {
      reportType: type,
      timeline,
      generatedAt: new Date().toISOString(),
      format: { csv: true, excel: true, pdf: true },
      summary: {
        records: rows.length,
        note: `Mock ${timeline} ${type} report compiled from JSON store`,
      },
      preview: rows.slice(0, 25),
      downloadUrl: `/api/reports/${type}/export?format=csv&timeline=${timeline}`,
    };
  }

  async exportCsv(type: string) {
    const report = await this.generate(type);
    const rows = report.preview;
    if (!rows.length) return 'id\n';
    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(','),
      ...rows.map((r) =>
        headers
          .map((h) => JSON.stringify(r[h] ?? ''))
          .join(','),
      ),
    ];
    return lines.join('\n');
  }
}
