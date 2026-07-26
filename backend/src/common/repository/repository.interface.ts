export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | undefined>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IRepository<T extends Entity> {
  findAll(options?: QueryOptions): Promise<PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  findOne(predicate: (item: T) => boolean): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id'>>): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  replaceAll(items: T[]): Promise<void>;
  count(predicate?: (item: T) => boolean): Promise<number>;
}
