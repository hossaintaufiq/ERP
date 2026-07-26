import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  private readonly repo: JsonRepository<UsersEntity>;

  constructor(store: JsonFileStore) {
    this.repo = new JsonRepository(store, 'users');
  }

  findAll(query: PaginationQueryDto & Record<string, any>) {
    const { page, limit, search, sortBy, sortDir, ...filters } = query;
    return this.repo.findAll({
      page,
      limit,
      search,
      sortBy,
      sortDir,
      searchFields: ["name","email","role"],
      filters,
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Users not found');
    return item;
  }

  create(dto: Record<string, any>) {
    return this.repo.create(dto as any);
  }

  async update(id: string, dto: Record<string, any>) {
    const updated = await this.repo.update(id, dto as any);
    if (!updated) throw new NotFoundException('Users not found');
    return updated;
  }

  async remove(id: string) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundException('Users not found');
    return { deleted: true };
  }

  async stats() {
    const all = await this.repo.raw();
    return { total: all.length };
  }
}
