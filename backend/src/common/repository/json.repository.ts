import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonFileStore } from '../storage/json-file.store';
import {
  Entity,
  IRepository,
  PaginatedResult,
  QueryOptions,
} from './repository.interface';

@Injectable()
export class JsonRepository<T extends Entity> implements IRepository<T> {
  constructor(
    protected readonly store: JsonFileStore,
    protected readonly collection: string,
  ) {}

  async findAll(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    let items = await this.store.readAll<T>(this.collection);
    const {
      page = 1,
      limit = 20,
      search,
      searchFields = [],
      sortBy,
      sortDir = 'desc',
      filters = {},
    } = options;

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      items = items.filter((item) => String((item as any)[key]) === String(value));
    });

    if (search && searchFields.length) {
      const q = search.toLowerCase();
      items = items.filter((item) =>
        searchFields.some((f) =>
          String((item as any)[f] ?? '')
            .toLowerCase()
            .includes(q),
        ),
      );
    }

    if (sortBy) {
      items = [...items].sort((a, b) => {
        const av = (a as any)[sortBy];
        const bv = (b as any)[sortBy];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.store.readAll<T>(this.collection);
    return items.find((i) => i.id === id) ?? null;
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.store.readAll<T>(this.collection);
    return items.find(predicate) ?? null;
  }

  async create(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id'>>,
  ): Promise<T> {
    return this.store.withLock(this.collection, async () => {
      const items = await this.store.readAll<T>(this.collection);
      const now = new Date().toISOString();
      const entity = {
        ...data,
        id: data.id ?? randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as T;
      items.push(entity);
      await this.store.writeAll(this.collection, items);
      return entity;
    });
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    return this.store.withLock(this.collection, async () => {
      const items = await this.store.readAll<T>(this.collection);
      const idx = items.findIndex((i) => i.id === id);
      if (idx < 0) return null;
      const updated = {
        ...items[idx],
        ...patch,
        id,
        updatedAt: new Date().toISOString(),
      } as T;
      items[idx] = updated;
      await this.store.writeAll(this.collection, items);
      return updated;
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.withLock(this.collection, async () => {
      const items = await this.store.readAll<T>(this.collection);
      const next = items.filter((i) => i.id !== id);
      if (next.length === items.length) return false;
      await this.store.writeAll(this.collection, next);
      return true;
    });
  }

  async replaceAll(items: T[]): Promise<void> {
    await this.store.writeAll(this.collection, items);
  }

  async count(predicate?: (item: T) => boolean): Promise<number> {
    const items = await this.store.readAll<T>(this.collection);
    return predicate ? items.filter(predicate).length : items.length;
  }

  async raw(): Promise<T[]> {
    return this.store.readAll<T>(this.collection);
  }
}
