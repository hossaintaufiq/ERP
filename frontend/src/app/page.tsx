'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { ModuleId } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LoginScreen from '@/components/auth/LoginScreen';
import AccessDenied from '@/components/auth/AccessDenied';
import { useAuth } from '@/lib/auth';
import { resources } from '@/lib/api';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  canAccessModule,
  firstAllowedModule,
  getAllowedModules,
  mergeRolesCatalog,
  resolveRole,
} from '@/lib/rbac';
import { listPayload } from '@/lib/utils';

import DashboardModule from '@/components/modules/DashboardModule';
import CustomerModule from '@/components/modules/CustomerModule';
import SalesModule from '@/components/modules/SalesModule';
import StyleModule from '@/components/modules/StyleModule';
import BomModule from '@/components/modules/BomModule';
import InventoryModule from '@/components/modules/InventoryModule';
import PurchaseModule from '@/components/modules/PurchaseModule';
import SupplierModule from '@/components/modules/SupplierModule';
import ProductionPlanningModule from '@/components/modules/ProductionPlanningModule';
import ProductionTrackingModule from '@/components/modules/ProductionTrackingModule';
import CuttingModule from '@/components/modules/CuttingModule';
import EmployeeModule from '@/components/modules/EmployeeModule';
import AttendanceModule from '@/components/modules/AttendanceModule';
import PayrollModule from '@/components/modules/PayrollModule';
import QcModule from '@/components/modules/QcModule';
import MachineModule from '@/components/modules/MachineModule';
import ShipmentModule from '@/components/modules/ShipmentModule';
import FinanceModule from '@/components/modules/FinanceModule';
import InvoicesModule from '@/components/modules/InvoicesModule';
import ExpensesModule from '@/components/modules/ExpensesModule';
import ReportsModule from '@/components/modules/ReportsModule';
import RolesModule from '@/components/modules/RolesModule';
import NotificationsModule from '@/components/modules/NotificationsModule';
import LeaveModule from '@/components/modules/LeaveModule';
import WarehouseModule from '@/components/modules/WarehouseModule';
import OrganizationModule from '@/components/modules/OrganizationModule';
import AuditModule from '@/components/modules/AuditModule';
import LeadsModule from '@/components/modules/LeadsModule';
import AiModule from '@/components/modules/AiModule';
import SettingsModule from '@/components/modules/SettingsModule';

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [activeRole, setActiveRole] = useState<string>('owner');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const rolesQ = useQuery({
    queryKey: ['roles-rbac'],
    queryFn: () => resources.list('roles', { limit: 50 }),
    enabled: isAuthenticated,
  });
  // Built-in catalog always available — API merges on top (never grant full access while loading)
  const roles = useMemo(() => mergeRolesCatalog(listPayload(rolesQ.data).rows), [rolesQ.data]);
  const activeRoleRecord = useMemo(() => resolveRole(roles, activeRole), [roles, activeRole]);
  const allowedModules = useMemo(() => getAllowedModules(activeRoleRecord), [activeRoleRecord]);

  // Only sync role from login identity — do not overwrite simulator on every user object churn
  React.useEffect(() => {
    if (user?.role) setActiveRole(user.role);
  }, [user?.id, user?.role]);

  React.useEffect(() => {
    if (!canAccessModule(activeRoleRecord, activeModule)) {
      setActiveModule(firstAllowedModule(activeRoleRecord, 'dashboard'));
    }
  }, [activeRole, activeRoleRecord, activeModule]);

  // Keep <html> in sync so body/theme tokens apply correctly
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    resources
      .list('notifications', { limit: 100 })
      .then((res: any) => {
        const unread = (res?.data || []).filter((n: any) => !n.read).length;
        setUnreadNotificationsCount(unread);
      })
      .catch(() => setUnreadNotificationsCount(0));
  }, [isAuthenticated, activeModule]);

  const handleSetRole = (roleId: string) => {
    setActiveRole(roleId);
  };

  const renderModuleView = () => {
    if (!canAccessModule(activeRoleRecord, activeModule)) {
      return (
        <AccessDenied
          moduleId={activeModule}
          roleName={activeRoleRecord.name}
          onBack={() => setActiveModule(firstAllowedModule(activeRoleRecord))}
        />
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule setActiveModule={setActiveModule} allowedModules={allowedModules} />;
      case 'customers':
        return <CustomerModule />;
      case 'sales':
        return <SalesModule />;
      case 'styles':
        return <StyleModule setActiveModule={setActiveModule} />;
      case 'bom':
        return <BomModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'purchase':
        return <PurchaseModule />;
      case 'suppliers':
        return <SupplierModule />;
      case 'production_planning':
        return <ProductionPlanningModule />;
      case 'production_tracking':
        return <ProductionTrackingModule />;
      case 'cutting':
        return <CuttingModule />;
      case 'employee':
        return <EmployeeModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'payroll':
        return <PayrollModule />;
      case 'qc':
        return <QcModule />;
      case 'machines':
        return <MachineModule />;
      case 'shipment':
        return <ShipmentModule />;
      case 'finance':
        return <FinanceModule />;
      case 'invoices':
        return <InvoicesModule />;
      case 'expenses':
        return <ExpensesModule />;
      case 'reports':
        return <ReportsModule />;
      case 'roles':
        return <RolesModule activeRole={activeRole} setActiveRole={handleSetRole} />;
      case 'notifications':
        return <NotificationsModule />;
      case 'leave':
        return <LeaveModule />;
      case 'warehouse':
        return <WarehouseModule />;
      case 'organization':
        return <OrganizationModule />;
      case 'audit':
        return <AuditModule />;
      case 'leads':
        return <LeadsModule />;
      case 'ai':
        return <AiModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule setActiveModule={setActiveModule} allowedModules={allowedModules} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm px-4 text-center">
        Loading Garments ERP…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const sidebarProps = {
    activeModule,
    setActiveModule,
    unreadNotificationsCount,
    allowedModules,
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground font-sans transition-colors duration-200">
        <div className="hidden lg:flex w-72 shrink-0 h-full">
          <Sidebar {...sidebarProps} className="w-full" />
        </div>

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="p-0 border-0" showClose={false}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar
              {...sidebarProps}
              className="w-full border-0"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header
            activeRole={activeRole}
            setActiveRole={handleSetRole}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            unreadCount={unreadNotificationsCount}
            allowedModules={allowedModules}
            onOpenNav={() => setMobileNavOpen(true)}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="p-3 sm:p-5 md:p-6 lg:p-8 pb-safe">
              <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">{renderModuleView()}</div>
            </div>
          </main>
        </div>
      </div>
  );
}
