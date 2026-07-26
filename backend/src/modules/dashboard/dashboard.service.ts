import { Injectable } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';

@Injectable()
export class DashboardService {
  constructor(private readonly store: JsonFileStore) {}

  async executive() {
    const [orders, inventory, production, employees, attendance, payroll, shipments, invoices, machines, qc] =
      await Promise.all([
        this.store.readAll<any>('orders'),
        this.store.readAll<any>('inventory'),
        this.store.readAll<any>('production'),
        this.store.readAll<any>('employees'),
        this.store.readAll<any>('attendance'),
        this.store.readAll<any>('payroll'),
        this.store.readAll<any>('shipments'),
        this.store.readAll<any>('invoices'),
        this.store.readAll<any>('machines'),
        this.store.readAll<any>('qc'),
      ]);

    const today = new Date().toISOString().slice(0, 10);
    const presentToday = attendance.filter((a) => a.date === today && a.status === 'Present').length;
    const delayed = orders.filter((o) => o.status === 'Delayed');
    const lowStock = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critical');
    const revenue = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const receivables = invoices.reduce((s, i) => s + (i.amount - (i.paidAmount || 0)), 0);
    const completedToday = production.reduce((s, p) => s + (p.completedQty || 0), 0);
    const runningMachines = machines.filter((m) => m.status === 'Running').length;
    const avgOee =
      machines.reduce((s, m) => s + (m.efficiency || 0), 0) / Math.max(machines.length, 1);
    const qcPassRate =
      (qc.filter((q) => q.result === 'Pass').length / Math.max(qc.length, 1)) * 100;

    const productionByStage = production.reduce((acc: Record<string, number>, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1;
      return acc;
    }, {});

    const revenueTrend = Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      return {
        month: month.toISOString().slice(0, 7),
        revenue: Math.round(revenue * (0.7 + i * 0.06)),
      };
    });

    return {
      kpis: {
        todaysProduction: completedToday,
        activeOrders: orders.filter((o) => ['Confirmed', 'In Production', 'Delayed'].includes(o.status)).length,
        delayedOrders: delayed.length,
        lowStockItems: lowStock.length,
        revenue,
        receivables,
        employees: employees.filter((e) => e.status === 'active').length,
        attendancePresent: presentToday,
        payrollNet: payroll.reduce((s, p) => s + (p.netPay || 0), 0),
        shipmentsInTransit: shipments.filter((s) => s.status === 'In Transit').length,
        machineUtilization: Math.round(avgOee * 10) / 10,
        runningMachines,
        qcPassRate: Math.round(qcPassRate * 10) / 10,
      },
      charts: {
        productionByStage,
        revenueTrend,
        orderStatus: orders.reduce((acc: Record<string, number>, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {}),
      },
      alerts: [
        ...delayed.slice(0, 3).map((o) => ({
          type: 'order',
          severity: 'high',
          message: `Order ${o.orderNumber} delayed (${o.buyer})`,
        })),
        ...lowStock.slice(0, 3).map((i) => ({
          type: 'stock',
          severity: i.status === 'Critical' ? 'high' : 'medium',
          message: `${i.name} is ${i.status} (${i.currentStock} ${i.unit})`,
        })),
      ],
    };
  }
}
