import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  private repo: JsonRepository<any>;
  constructor(store: JsonFileStore) {
    this.repo = new JsonRepository(store, 'settings');
  }

  @Get()
  async get() {
    const all = await this.repo.raw();
    return all[0] || {};
  }

  @Patch()
  async update(@Body() dto: Record<string, any>) {
    const all = await this.repo.raw();
    if (!all[0]) return this.repo.create(dto as any);
    return this.repo.update(all[0].id, dto);
  }
}
