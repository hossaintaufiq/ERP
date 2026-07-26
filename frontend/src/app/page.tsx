'use client';

import React, { useState } from 'react';
import Sidebar, { ModuleId } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LoginScreen from '@/components/auth/LoginScreen';
import { useAuth } from '@/lib/auth';

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
import EmployeeModule from '@/components/modules/EmployeeModule';
import AttendanceModule from '@/components/modules/AttendanceModule';
import PayrollModule from '@/components/modules/PayrollModule';
import QcModule from '@/components/modules/QcModule';
import MachineModule from '@/components/modules/MachineModule';
import ShipmentModule from '@/components/modules/ShipmentModule';
import FinanceModule from '@/components/modules/FinanceModule';
import ReportsModule from '@/components/modules/ReportsModule';
import RolesModule from '@/components/modules/RolesModule';
import NotificationsModule from '@/components/modules/NotificationsModule';
import LeaveModule from '@/components/modules/LeaveModule';
import WarehouseModule from '@/components/modules/WarehouseModule';
import LeadsModule from '@/components/modules/LeadsModule';
import AiModule from '@/components/modules/AiModule';
import SettingsModule from '@/components/modules/SettingsModule';

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [activeRole, setActiveRole] = useState<string>('owner');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  React.useEffect(() => {
    if (user?.role) setActiveRole(user.role === 'owner' ? 'owner' : user.role);
  }, [user]);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    import('@/lib/api').then(({ resources }) => {
      resources
        .list('notifications', { limit: 100 })
        .then((res: any) => {
          const unread = (res?.data || []).filter((n: any) => !n.read).length;
          setUnreadNotificationsCount(unread);
        })
        .catch(() => setUnreadNotificationsCount(0));
    });
  }, [isAuthenticated, activeModule]);

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule setActiveModule={setActiveModule} />;
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
      case 'reports':
        return <ReportsModule />;
      case 'roles':
        return <RolesModule activeRole={activeRole} setActiveRole={setActiveRole} />;
      case 'notifications':
        return <NotificationsModule />;
      case 'leave':
        return <LeaveModule />;
      case 'warehouse':
        return <WarehouseModule />;
      case 'leads':
        return <LeadsModule />;
      case 'ai':
        return <AiModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule setActiveModule={setActiveModule} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-canvas-dark text-stone-500 text-sm">
        Loading Garments ERP…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen overflow-hidden bg-canvas dark:bg-canvas-dark text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Header
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            unreadCount={unreadNotificationsCount}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
            <div className="max-w-7xl mx-auto space-y-6">{renderModuleView()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
