import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { BuyersEntity } from './buyers.entity';

@Injectable()
export class BuyersService {
  private readonly repo: JsonRepository<BuyersEntity>;

  constructor(store: JsonFileStore) {
    this.repo = new JsonRepository(store, 'buyers');
  }

  findAll(query: PaginationQueryDto & Record<string, any>) {
    const { page, limit, search, sortBy, sortDir, ...filters } = query;
    return this.repo.findAll({
      page,
      limit,
      search,
      sortBy,
      sortDir,
      searchFields: ["name","code","country"],
      filters,
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Buyers not found');
    return item;
  }

  create(dto: Record<string, any>) {
    return this.repo.create(dto as any);
  }

  async update(id: string, dto: Record<string, any>) {
    const updated = await this.repo.update(id, dto as any);
    if (!updated) throw new NotFoundException('Buyers not found');
    return updated;
  }

  async remove(id: string) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundException('Buyers not found');
    return { deleted: true };
  }

  async stats() {
    const all = await this.repo.raw();
    return { total: all.length };
  }
}
