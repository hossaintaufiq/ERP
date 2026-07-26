import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonFileStore implements OnModuleInit {
  private readonly dataDir = path.join(process.cwd(), 'src', 'data');
  private locks = new Map<string, Promise<void>>();

  onModuleInit() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private filePath(collection: string) {
    return path.join(this.dataDir, `${collection}.json`);
  }

  async readAll<T>(collection: string): Promise<T[]> {
    const fp = this.filePath(collection);
    if (!fs.existsSync(fp)) {
      await this.writeAll(collection, []);
      return [];
    }
    const raw = await fs.promises.readFile(fp, 'utf8');
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : parsed.items ?? [];
    } catch {
      return [];
    }
  }

  async writeAll<T>(collection: string, items: T[]): Promise<void> {
    const fp = this.filePath(collection);
    const tmp = `${fp}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');
    await fs.promises.rename(tmp, fp);
  }

  async withLock<T>(collection: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(collection) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    this.locks.set(
      collection,
      prev.then(() => gate),
    );
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }
}
