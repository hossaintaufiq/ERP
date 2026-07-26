import type { ModuleId } from '@/components/layout/Sidebar';

export type RoleRecord = {
  id: string;
  name: string;
  permissions?: string[];
};

/** Permissions that unlock each module. Empty = available to every role. */
export const MODULE_ACCESS: Record<ModuleId, string[]> = {
  dashboard: [],
  notifications: [],
  roles: [], // always reachable so persona can be switched from this screen
  ai: ['*', 'ai.*', 'dashboard.*'],
  settings: ['*', 'settings.*', 'admin.*'],
  organization: ['*', 'settings.*', 'admin.*', 'employees.*', 'hr.*'],
  audit: ['*', 'audit.*', 'admin.*', 'settings.*'],

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

  production_planning: ['production.*', 'production.read', 'production.write.output'],
  production_tracking: ['production.*', 'production.read', 'production.write.output'],
  cutting: ['production.*', 'production.read', 'inventory.*', 'bom.*'],
  qc: ['qc.*'],
  machines: ['machines.*'],

  employee: ['employees.*', 'hr.*', 'employees.read'],
  attendance: ['attendance.*', 'hr.*'],
  leave: ['leave.*', 'hr.*'],
  payroll: ['payroll.*', 'payroll.read', 'hr.*'],
  shipment: ['shipments.*', 'logistics.*', 'production.*'],
  reports: ['reports.*', 'reports.finance', 'finance.*', '*'],
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

function permissionMatches(granted: string[], needed: string): boolean {
  if (granted.includes('*')) return true;
  if (granted.includes(needed)) return true;

  const [domain, action = '*'] = needed.split('.');
  if (granted.includes(`${domain}.*`)) return true;

  // module asks for domain.* → any grant under that domain counts
  if (action === '*') {
    return granted.some((g) => g === domain || g.startsWith(`${domain}.`));
  }

  return false;
}

export function roleHasPermission(role: RoleRecord | null | undefined, needed: string): boolean {
  const granted = role?.permissions || [];
  return permissionMatches(granted, needed);
}

export function canAccessModule(role: RoleRecord | null | undefined, moduleId: ModuleId): boolean {
  const required = MODULE_ACCESS[moduleId] ?? [];
  if (!required.length) return true;
  const granted = role?.permissions || [];
  if (granted.includes('*')) return true;
  return required.some((need) => permissionMatches(granted, need));
}

export function getAllowedModules(role: RoleRecord | null | undefined): ModuleId[] {
  return (Object.keys(MODULE_ACCESS) as ModuleId[]).filter((id) => canAccessModule(role, id));
}

export function firstAllowedModule(role: RoleRecord | null | undefined, preferred: ModuleId = 'dashboard'): ModuleId {
  const allowed = getAllowedModules(role);
  if (allowed.includes(preferred)) return preferred;
  return allowed[0] || 'dashboard';
}

export function describeAccess(role: RoleRecord | null | undefined): string {
  const granted = role?.permissions || [];
  if (granted.includes('*')) return 'Full system access';
  if (!granted.length) return 'No permissions assigned';
  return granted.join(' · ');
}
