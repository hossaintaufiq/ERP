/**
 * Generates NestJS CRUD modules for collections.
 * Run from backend: npx ts-node src/scripts/generate-modules.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const modulesDir = path.join(__dirname, '..', 'modules');

const modules: { name: string; collection: string; searchFields: string[]; route: string }[] = [
  { name: 'employees', collection: 'employees', searchFields: ['name', 'employeeCode', 'department'], route: 'employees' },
  { name: 'buyers', collection: 'buyers', searchFields: ['name', 'code', 'country'], route: 'buyers' },
  { name: 'suppliers', collection: 'suppliers', searchFields: ['name', 'code', 'country'], route: 'suppliers' },
  { name: 'styles', collection: 'styles', searchFields: ['name', 'styleNumber', 'buyer'], route: 'styles' },
  { name: 'orders', collection: 'orders', searchFields: ['orderNumber', 'buyer', 'styleNumber'], route: 'orders' },
  { name: 'inventory', collection: 'inventory', searchFields: ['name', 'code', 'category'], route: 'inventory' },
  { name: 'purchase-orders', collection: 'purchase-orders', searchFields: ['poNumber', 'supplier', 'status'], route: 'purchase-orders' },
  { name: 'machines', collection: 'machines', searchFields: ['name', 'code', 'type'], route: 'machines' },
  { name: 'production', collection: 'production', searchFields: ['orderNumber', 'styleNumber', 'stage'], route: 'production' },
  { name: 'attendance', collection: 'attendance', searchFields: ['employeeName', 'employeeCode', 'status'], route: 'attendance' },
  { name: 'leave', collection: 'leave', searchFields: ['employeeName', 'type', 'status'], route: 'leave' },
  { name: 'payroll', collection: 'payroll', searchFields: ['employeeName', 'employeeCode', 'period'], route: 'payroll' },
  { name: 'shipments', collection: 'shipments', searchFields: ['shipmentNumber', 'buyer', 'containerNo'], route: 'shipments' },
  { name: 'invoices', collection: 'invoices', searchFields: ['invoiceNumber', 'buyer', 'status'], route: 'invoices' },
  { name: 'qc', collection: 'qc', searchFields: ['orderNumber', 'gate', 'result'], route: 'qc' },
  { name: 'expenses', collection: 'expenses', searchFields: ['category', 'description', 'status'], route: 'expenses' },
  { name: 'notifications', collection: 'notifications', searchFields: ['title', 'type', 'severity'], route: 'notifications' },
  { name: 'audit', collection: 'audit', searchFields: ['action', 'entity', 'userName'], route: 'audit' },
  { name: 'warehouses', collection: 'warehouses', searchFields: ['name', 'code'], route: 'warehouses' },
  { name: 'stock-transfers', collection: 'stock-transfers', searchFields: ['transferNumber', 'status'], route: 'stock-transfers' },
  { name: 'leads', collection: 'leads', searchFields: ['companyName', 'contact', 'status'], route: 'leads' },
  { name: 'quotations', collection: 'quotations', searchFields: ['quotationNumber', 'status'], route: 'quotations' },
  { name: 'companies', collection: 'companies', searchFields: ['name', 'code'], route: 'companies' },
  { name: 'branches', collection: 'branches', searchFields: ['name', 'code'], route: 'branches' },
  { name: 'departments', collection: 'departments', searchFields: ['name', 'code'], route: 'departments' },
  { name: 'users', collection: 'users', searchFields: ['name', 'email', 'role'], route: 'users' },
  { name: 'roles', collection: 'roles', searchFields: ['name', 'id'], route: 'roles' },
];

function pascal(s: string) {
  return s
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function gen(mod: (typeof modules)[0]) {
  const P = pascal(mod.name);
  const dir = path.join(modulesDir, mod.name);
  fs.mkdirSync(dir, { recursive: true });

  const entity = `import { Entity } from '../../common/repository/repository.interface';

export interface ${P}Entity extends Entity {
  [key: string]: any;
}
`;

  const service = `import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ${P}Entity } from './${mod.name}.entity';

@Injectable()
export class ${P}Service {
  private readonly repo: JsonRepository<${P}Entity>;

  constructor(store: JsonFileStore) {
    this.repo = new JsonRepository(store, '${mod.collection}');
  }

  findAll(query: PaginationQueryDto & Record<string, any>) {
    const { page, limit, search, sortBy, sortDir, ...filters } = query;
    return this.repo.findAll({
      page,
      limit,
      search,
      sortBy,
      sortDir,
      searchFields: ${JSON.stringify(mod.searchFields)},
      filters,
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('${P} not found');
    return item;
  }

  create(dto: Record<string, any>) {
    return this.repo.create(dto as any);
  }

  async update(id: string, dto: Record<string, any>) {
    const updated = await this.repo.update(id, dto as any);
    if (!updated) throw new NotFoundException('${P} not found');
    return updated;
  }

  async remove(id: string) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundException('${P} not found');
    return { deleted: true };
  }

  async stats() {
    const all = await this.repo.raw();
    return { total: all.length };
  }
}
`;

  const controller = `import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ${P}Service } from './${mod.name}.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('${mod.route}')
@ApiBearerAuth()
@Controller('${mod.route}')
export class ${P}Controller {
  constructor(private readonly service: ${P}Service) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('stats/summary')
  stats() {
    return this.service.stats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: Record<string, any>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Record<string, any>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
`;

  const moduleFile = `import { Module } from '@nestjs/common';
import { ${P}Controller } from './${mod.name}.controller';
import { ${P}Service } from './${mod.name}.service';

@Module({
  controllers: [${P}Controller],
  providers: [${P}Service],
  exports: [${P}Service],
})
export class ${P}Module {}
`;

  fs.writeFileSync(path.join(dir, `${mod.name}.entity.ts`), entity);
  fs.writeFileSync(path.join(dir, `${mod.name}.service.ts`), service);
  fs.writeFileSync(path.join(dir, `${mod.name}.controller.ts`), controller);
  fs.writeFileSync(path.join(dir, `${mod.name}.module.ts`), moduleFile);
  console.log(`Generated ${mod.name}`);
}

modules.forEach(gen);

const imports = modules
  .map((m) => {
    const P = pascal(m.name);
    return `import { ${P}Module } from './modules/${m.name}/${m.name}.module';`;
  })
  .join('\n');

const moduleList = modules.map((m) => `${pascal(m.name)}Module`).join(',\n    ');

fs.writeFileSync(
  path.join(__dirname, '..', 'generated-modules.ts'),
  `${imports}\n\nexport const GENERATED_MODULES = [\n    ${moduleList}\n];\n`,
);

console.log('Done. Wire GENERATED_MODULES into AppModule.');
