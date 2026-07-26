import type { ModuleId } from '@/components/layout/Sidebar';

export type RoleRecord = {
  id: string;
  name: string;
  permissions?: string[];
};

/**
 * Built-in role catalog used for the access simulator.
 * API roles merge on top (by id) when available.
 */
export const BUILTIN_ROLES: RoleRecord[] = [
  { id: 'owner', name: 'Owner', permissions: ['*'] },
  { id: 'ceo', name: 'CEO', permissions: ['*'] },
  { id: 'admin', name: 'Admin', permissions: ['*'] },
  {
    id: 'hr',
    name: 'HR Manager',
    permissions: ['hr.*', 'employees.*', 'attendance.*', 'leave.*', 'payroll.read', 'payroll.*'],
  },
  {
    id: 'factory_manager',
    name: 'Factory Manager',
    permissions: ['production.*', 'qc.*', 'machines.*', 'employees.read', 'shipments.*', 'inventory.*'],
  },
  {
    id: 'store_manager',
    name: 'Store Manager',
    permissions: ['inventory.*', 'warehouse.*', 'procurement.*', 'suppliers.*', 'bom.*'],
  },
  {
    id: 'operator',
    name: 'Operator',
    permissions: ['production.read', 'production.write.output'],
  },
  {
    id: 'qc_inspector',
    name: 'QC Inspector',
    permissions: ['qc.*', 'production.read'],
  },
  {
    id: 'accountant',
    name: 'Accountant',
    permissions: ['finance.*', 'invoices.*', 'expenses.*', 'reports.finance', 'reports.*'],
  },
  {
    id: 'merchandiser',
    name: 'Merchandiser',
    permissions: ['buyers.*', 'orders.*', 'styles.*', 'bom.*', 'leads.*', 'quotations.*'],
  },
  {
    id: 'cutting_master',
    name: 'Cutting Master',
    permissions: ['production.*', 'production.read', 'inventory.*', 'bom.*', 'styles.*'],
  },
];

/** Permissions that unlock each module. Empty = available to every authenticated role. */
export const MODULE_ACCESS: Record<ModuleId, string[]> = {
  // Always available so users can navigate / switch persona
  dashboard: [],
  notifications: [],
  roles: [],

  ai: ['ai.*', 'dashboard.*', 'admin.*'],
  settings: ['settings.*', 'admin.*'],
  organization: ['settings.*', 'admin.*', 'employees.*', 'hr.*'],
  audit: ['audit.*', 'admin.*', 'settings.*'],

  leads: ['buyers.*', 'orders.*', 'leads.*', 'quotations.*'],
  customers: ['buyers.*'],
  sales: ['orders.*'],
  finance: ['finance.*', 'invoices.*', 'reports.finance'],
  invoices: ['finance.*', 'invoices.*', 'reports.finance'],
  expenses: ['finance.*', 'expenses.*', 'reports.finance'],

  styles: ['styles.*'],
  bom: ['bom.*', 'styles.*'],

  inventory: ['inventory.*'],
  warehouse: ['warehouse.*', 'inventory.*'],
  purchase: ['procurement.*', 'purchase.*', 'purchase-orders.*'],
  suppliers: ['procurement.*', 'suppliers.*'],

  // Exact production grants — production.read must not unlock shipments via production.*
  production_planning: ['production.*', 'production.read', 'production.write.output'],
  production_tracking: ['production.*', 'production.read', 'production.write.output'],
  cutting: ['production.*', 'inventory.*', 'bom.*'],
  qc: ['qc.*'],
  machines: ['machines.*'],

  employee: ['employees.*', 'hr.*', 'employees.read'],
  attendance: ['attendance.*', 'hr.*'],
  leave: ['leave.*', 'hr.*'],
  payroll: ['payroll.*', 'payroll.read', 'hr.*'],
  shipment: ['shipments.*', 'logistics.*'],
  reports: ['reports.*', 'reports.finance', 'finance.*'],
};

export const MODULE_LABELS: Record<ModuleId, string> = {
  dashboard: 'Dashboard',
  roles: 'Roles & Access',
  notifications: 'Notifications',
  ai: 'AI Assistant',
  settings: 'Settings',
  organization: 'Organization',
  audit: 'Audit Trail',
  leads: 'Leads & Quotations',
  customers: 'Customers / Buyers',
  sales: 'Sales Orders',
  finance: 'Finance',
  invoices: 'Invoices & AR',
  expenses: 'Expenses',
  styles: 'Styles',
  bom: 'BOM Calculator',
  inventory: 'Inventory',
  warehouse: 'Warehouses',
  purchase: 'Purchase',
  suppliers: 'Suppliers',
  production_planning: 'Production Schedule',
  production_tracking: 'Floor Tracking',
  cutting: 'Cutting & Fabric Issue',
  qc: 'Quality Control',
  machines: 'Machines',
  employee: 'Employees',
  attendance: 'Attendance',
  leave: 'Leave',
  payroll: 'Payroll',
  shipment: 'Shipments',
  reports: 'Reports',
};

/** Always return a string[] — never call .includes on a raw permissions string. */
export function normalizePermissions(perms: unknown): string[] {
  if (!perms) return [];
  if (Array.isArray(perms)) return perms.map((p) => String(p).trim()).filter(Boolean);
  if (typeof perms === 'string') {
    return perms
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeRole(raw: any, fallbackId = 'unknown'): RoleRecord {
  const id = String(raw?.id || fallbackId);
  const builtin = BUILTIN_ROLES.find((r) => r.id === id);
  const permissions = normalizePermissions(raw?.permissions ?? builtin?.permissions);
  return {
    id,
    name: String(raw?.name || builtin?.name || id),
    permissions,
  };
}

/** Merge API roles with builtins so simulator always has correct permission sets. */
export function mergeRolesCatalog(apiRoles: any[] | undefined | null): RoleRecord[] {
  const byId = new Map<string, RoleRecord>();
  for (const r of BUILTIN_ROLES) byId.set(r.id, { ...r, permissions: [...(r.permissions || [])] });
  for (const raw of apiRoles || []) {
    const normalized = normalizeRole(raw);
    const existing = byId.get(normalized.id);
    const perms = normalized.permissions || [];
    // Prefer non-empty API permissions; otherwise keep builtin
    if (perms.length) {
      byId.set(normalized.id, {
        ...existing,
        ...normalized,
        permissions: perms,
      });
    } else if (existing) {
      byId.set(normalized.id, { ...existing, name: normalized.name || existing.name });
    } else {
      byId.set(normalized.id, normalized);
    }
  }
  return Array.from(byId.values());
}

export function resolveRole(
  roles: RoleRecord[],
  roleId: string | null | undefined,
): RoleRecord {
  const id = roleId || 'owner';
  const found = roles.find((r) => r.id === id);
  if (found) return normalizeRole(found);
  const builtin = BUILTIN_ROLES.find((r) => r.id === id);
  if (builtin) return { ...builtin, permissions: [...(builtin.permissions || [])] };
  // Unknown role → deny-by-default (not full access)
  return { id, name: id, permissions: [] };
}

function permissionMatches(granted: string[], needed: string): boolean {
  if (!needed) return false;
  if (granted.includes('*')) return true;

  // Module mistakenly listing '*' as a requirement only matches superuser
  if (needed === '*') return granted.includes('*');

  if (granted.includes(needed)) return true;

  const [domain, action = '*'] = needed.split('.');
  if (!domain) return false;

  // granted domain.* covers needed domain.anything
  if (granted.includes(`${domain}.*`)) return true;

  // needed domain.* is satisfied by any granted domain.x (exact domain grant)
  // BUT do not let domain.read satisfy a requirement written as domain.* when
  // we want strict module gates — callers should list both production.* and production.read.
  if (action === '*') {
    return granted.some((g) => g === domain || g === `${domain}.*`);
  }

  return false;
}

export function roleHasPermission(role: RoleRecord | null | undefined, needed: string): boolean {
  const granted = normalizePermissions(role?.permissions);
  return permissionMatches(granted, needed);
}

export function canAccessModule(role: RoleRecord | null | undefined, moduleId: ModuleId): boolean {
  const required = MODULE_ACCESS[moduleId] ?? [];
  if (!required.length) return true;
  const granted = normalizePermissions(role?.permissions);
  if (granted.includes('*')) return true;
  return required.some((need) => permissionMatches(granted, need));
}

export function getAllowedModules(role: RoleRecord | null | undefined): ModuleId[] {
  return (Object.keys(MODULE_ACCESS) as ModuleId[]).filter((id) => canAccessModule(role, id));
}

export function firstAllowedModule(
  role: RoleRecord | null | undefined,
  preferred: ModuleId = 'dashboard',
): ModuleId {
  const allowed = getAllowedModules(role);
  if (allowed.includes(preferred)) return preferred;
  return allowed[0] || 'dashboard';
}

export function describeAccess(role: RoleRecord | null | undefined): string {
  const granted = normalizePermissions(role?.permissions);
  if (granted.includes('*')) return 'Full system access';
  if (!granted.length) return 'No permissions assigned';
  return granted.join(' · ');
}

export function isFullAccess(role: RoleRecord | null | undefined): boolean {
  return normalizePermissions(role?.permissions).includes('*');
}
