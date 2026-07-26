import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JsonFileStore } from '../../common/storage/json-file.store';

@ApiTags('search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly store: JsonFileStore) {}

  @Get()
  async search(@Query('q') q = '') {
    const query = q.toLowerCase().trim();
    if (!query) return { results: [] };

    const collections = [
      { key: 'orders', fields: ['orderNumber', 'buyer', 'styleNumber'] },
      { key: 'employees', fields: ['name', 'employeeCode'] },
      { key: 'buyers', fields: ['name', 'code'] },
      { key: 'inventory', fields: ['name', 'code'] },
      { key: 'styles', fields: ['name', 'styleNumber'] },
      { key: 'shipments', fields: ['shipmentNumber', 'containerNo'] },
    ];

    const results: any[] = [];
    for (const c of collections) {
      const rows = await this.store.readAll<any>(c.key);
      rows.forEach((row) => {
        if (c.fields.some((f) => String(row[f] || '').toLowerCase().includes(query))) {
          results.push({ type: c.key, id: row.id, label: row.name || row.orderNumber || row.employeeCode || row.code || row.id, raw: row });
        }
      });
    }
    return { results: results.slice(0, 40) };
  }
}
