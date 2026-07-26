import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalize list API payloads: `{ data, meta }` or bare array */
export function listPayload(result: any): { rows: any[]; meta?: any } {
  if (!result) return { rows: [] };
  if (Array.isArray(result)) return { rows: result };
  if (Array.isArray(result.data)) return { rows: result.data, meta: result.meta };
  if (Array.isArray(result.data?.data)) {
    return { rows: result.data.data, meta: result.data.meta || result.meta };
  }
  return { rows: [] };
}
