import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonFileStore } from '../../common/storage/json-file.store';
import { JsonRepository } from '../../common/repository/json.repository';

/**
 * Cross-module garments workflow orchestrator.
 * Create PO → inventory + finance + notification + audit
 */
@Injectable()
export class WorkflowService {
  private pos: JsonRepository<any>;
  private inventory: JsonRepository<any>;
  private notifications: JsonRepository<any>;
  private audit: JsonRepository<any>;
  private production: JsonRepository<any>;
  private orders: JsonRepository<any>;
  private invoices: JsonRepository<any>;
  private shipments: JsonRepository<any>;

  constructor(store: JsonFileStore) {
    this.pos = new JsonRepository(store, 'purchase-orders');
    this.inventory = new JsonRepository(store, 'inventory');
    this.notifications = new JsonRepository(store, 'notifications');
    this.audit = new JsonRepository(store, 'audit');
    this.production = new JsonRepository(store, 'production');
    this.orders = new JsonRepository(store, 'orders');
    this.invoices = new JsonRepository(store, 'invoices');
    this.shipments = new JsonRepository(store, 'shipments');
  }

  async advancePurchaseOrder(poId: string, user?: any) {
    const po = await this.pos.findById(poId);
    if (!po) throw new BadRequestException('PO not found');

    const flow = [
      'Draft',
      'PR Approved',
      'PO Issued',
      'Materials Received',
      'Stock Updated',
      'Payment Pending',
      'Closed',
    ];
    const idx = flow.indexOf(po.status);
    if (idx < 0 || idx >= flow.length - 1) {
      throw new BadRequestException('Cannot advance PO status');
    }
    const next = flow[idx + 1];
    const updated = await this.pos.update(poId, { status: next });

    if (next === 'Stock Updated' || next === 'Materials Received') {
      for (const mat of po.materials || []) {
        const item = await this.inventory.findOne((i) => i.name === mat.name);
        if (item) {
          const stock = (item.currentStock || 0) + (mat.qty || 0);
          const status =
            stock < item.minAlertLevel * 0.3
              ? 'Critical'
              : stock < item.minAlertLevel
                ? 'Low Stock'
                : 'In Stock';
          await this.inventory.update(item.id, {
            currentStock: stock,
            status,
            lastRestocked: new Date().toISOString().slice(0, 10),
          });
        }
      }
    }

    await this.notifications.create({
      title: `PO ${po.poNumber} → ${next}`,
      message: `Purchase order advanced to ${next}`,
      type: 'procurement',
      severity: 'info',
      read: false,
      userId: user?.id || 'user-1',
      companyId: po.companyId || 'co-1',
    });

    await this.audit.create({
      action: 'APPROVE',
      entity: 'PurchaseOrder',
      entityId: poId,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      details: `Status ${po.status} → ${next}`,
      ip: '0.0.0.0',
      companyId: po.companyId || 'co-1',
    });

    return updated;
  }

  async advanceProduction(productionId: string, user?: any) {
    const stages = [
      'cutting',
      'printing',
      'embroidery',
      'sewing',
      'washing',
      'ironing',
      'packing',
      'shipment',
    ];
    const prod = await this.production.findById(productionId);
    if (!prod) throw new BadRequestException('Production record not found');
    const idx = stages.indexOf(prod.stage);
    if (idx < 0 || idx >= stages.length - 1) {
      throw new BadRequestException('Cannot advance stage');
    }
    const next = stages[idx + 1];
    const updated = await this.production.update(productionId, { stage: next });
    if (prod.orderId) {
      await this.orders.update(prod.orderId, { stage: next });
    }
    await this.notifications.create({
      title: `Production advanced`,
      message: `${prod.orderNumber} moved to ${next}`,
      type: 'production',
      severity: 'info',
      read: false,
      userId: user?.id || 'user-1',
      companyId: 'co-1',
    });
    await this.audit.create({
      action: 'UPDATE',
      entity: 'Production',
      entityId: productionId,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      details: `${prod.stage} → ${next}`,
      ip: '0.0.0.0',
      companyId: 'co-1',
    });
    return updated;
  }

  async createInvoiceFromShipment(shipmentId: string, user?: any) {
    const shipment = await this.shipments.findById(shipmentId);
    if (!shipment) throw new BadRequestException('Shipment not found');
    const order = await this.orders.findById(shipment.orderId);
    if (!order) throw new BadRequestException('Order not found');

    const invoice = await this.invoices.create({
      invoiceNumber: `INV-AUTO-${Date.now()}`,
      orderId: order.id,
      shipmentId,
      buyerId: order.buyerId,
      buyer: order.buyer,
      amount: order.totalValue,
      currency: 'USD',
      status: 'Sent',
      dueDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      paidAmount: 0,
      companyId: 'co-1',
    });

    await this.orders.update(order.id, { status: 'Invoiced' });
    await this.notifications.create({
      title: 'Invoice generated',
      message: `${invoice.invoiceNumber} for ${order.buyer}`,
      type: 'finance',
      severity: 'medium',
      read: false,
      userId: user?.id || 'user-1',
      companyId: 'co-1',
    });

    return invoice;
  }
}
