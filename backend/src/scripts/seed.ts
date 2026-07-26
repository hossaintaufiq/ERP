/**
 * Generates enterprise-scale JSON datasets for Garments ERP.
 * Run: npx ts-node src/scripts/seed.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

const dataDir = path.join(__dirname, '..', 'data');
const now = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function write(name: string, data: unknown) {
  fs.writeFileSync(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`✓ ${name}.json (${Array.isArray(data) ? data.length : 'ok'} records)`);
}

async function main() {
  ensureDir();
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const companies = [
    {
      id: 'co-1',
      name: 'Garments ERP Apparel Ltd',
      code: 'GEA',
      country: 'Bangladesh',
      city: 'Dhaka',
      address: 'Plot 12, CEPZ, Chittagong',
      currency: 'USD',
      fiscalYearStart: '07-01',
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const branches = [
    { id: 'br-1', companyId: 'co-1', name: 'Chittagong Factory', code: 'CTG', type: 'factory', createdAt: now(), updatedAt: now() },
    { id: 'br-2', companyId: 'co-1', name: 'Dhaka Head Office', code: 'DAC', type: 'office', createdAt: now(), updatedAt: now() },
    { id: 'br-3', companyId: 'co-1', name: 'CEPZ Warehouse', code: 'WH1', type: 'warehouse', createdAt: now(), updatedAt: now() },
  ];

  const departments = [
    'Merchandising', 'Cutting', 'Sewing', 'Quality', 'Finishing', 'Packing',
    'Warehouse', 'HR', 'Accounts', 'Maintenance', 'IE', 'Planning',
  ].map((name, i) => ({
    id: `dept-${i + 1}`,
    companyId: 'co-1',
    branchId: 'br-1',
    name,
    code: name.slice(0, 3).toUpperCase(),
    createdAt: now(),
    updatedAt: now(),
  }));

  const roleDefs = [
    { id: 'owner', name: 'Owner', permissions: ['*'] },
    { id: 'ceo', name: 'CEO', permissions: ['*'] },
    { id: 'admin', name: 'Admin', permissions: ['*'] },
    { id: 'hr', name: 'HR Manager', permissions: ['hr.*', 'employees.*', 'attendance.*', 'leave.*', 'payroll.read'] },
    { id: 'factory_manager', name: 'Factory Manager', permissions: ['production.*', 'qc.*', 'machines.*', 'employees.read'] },
    { id: 'store_manager', name: 'Store Manager', permissions: ['inventory.*', 'warehouse.*', 'procurement.*'] },
    { id: 'operator', name: 'Operator', permissions: ['production.read', 'production.write.output'] },
    { id: 'qc_inspector', name: 'QC Inspector', permissions: ['qc.*', 'production.read'] },
    { id: 'accountant', name: 'Accountant', permissions: ['finance.*', 'reports.finance'] },
    { id: 'merchandiser', name: 'Merchandiser', permissions: ['buyers.*', 'orders.*', 'styles.*', 'bom.*'] },
  ];

  const users = [
    { id: 'user-1', email: 'owner@garmentserp.com', name: 'Al-Mustafiz Rahman', role: 'owner', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-2', email: 'hr@garmentserp.com', name: 'Ayesha Siddiqua', role: 'hr', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-3', email: 'factory@garmentserp.com', name: 'MD. Tariqul Islam', role: 'factory_manager', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-4', email: 'store@garmentserp.com', name: 'Mahbub Alam', role: 'store_manager', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-5', email: 'accounts@garmentserp.com', name: 'Nusrat Jahan', role: 'accountant', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-6', email: 'qc@garmentserp.com', name: 'Shahadat Hossain', role: 'qc_inspector', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-7', email: 'merch@garmentserp.com', name: 'Farhana Akter', role: 'merchandiser', passwordHash, companyId: 'co-1', status: 'active', createdAt: now(), updatedAt: now() },
  ];

  const firstNames = ['Rahim', 'Karim', 'Salma', 'Nasrin', 'Jamal', 'Rafiq', 'Fatema', 'Hasan', 'Rina', 'Imran', 'Sultana', 'Kabir', 'Mitu', 'Anwar', 'Shila'];
  const lastNames = ['Islam', 'Hossain', 'Akter', 'Begum', 'Khan', 'Rahman', 'Ahmed', 'Chowdhury', 'Siddique', 'Uddin'];
  const designations = ['Operator', 'Senior Operator', 'Helper', 'Line Chief', 'QC Inspector', 'Mechanic', 'Supervisor', 'Iron Man', 'Packer', 'Cutter'];

  const employees = Array.from({ length: 520 }, (_, i) => {
    const dept = pick(departments);
    const salary = rand(12000, 55000);
    return {
      id: `emp-${i + 1}`,
      employeeCode: `GE-EMP-${String(i + 1).padStart(4, '0')}`,
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      departmentId: dept.id,
      department: dept.name,
      designation: pick(designations),
      branchId: 'br-1',
      companyId: 'co-1',
      salary,
      shift: pick(['Day Shift (8am-5pm)', 'Night Shift (8pm-5am)']),
      joiningDate: daysAgo(rand(30, 1800)).slice(0, 10),
      phone: `+880 17${rand(10, 99)} ${rand(100000, 999999)}`,
      status: pick(['active', 'active', 'active', 'inactive']),
      attendanceRate: rand(85, 100),
      performanceScore: rand(70, 99),
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const buyers = [
    { id: 'buy-1', name: 'Zara (Inditex)', code: 'ZARA', country: 'Spain', paymentTerms: 'LC 60 Days', creditLimit: 2500000, status: 'active', compliance: ['BSCI', 'OEKO-TEX'], contactPerson: 'Carlos Mendez', email: 'sourcing@zara.com', phone: '+34 900 100 200' },
    { id: 'buy-2', name: 'H&M Hennes & Mauritz', code: 'HM', country: 'Sweden', paymentTerms: 'TT 45 Days', creditLimit: 1800000, status: 'active', compliance: ['HIGG', 'GOTS'], contactPerson: 'Anna Lindberg', email: 'vendor@hm.com', phone: '+46 8 796 5500' },
    { id: 'buy-3', name: 'Primark Stores Ltd', code: 'PRIM', country: 'Ireland', paymentTerms: 'LC 90 Days', creditLimit: 1200000, status: 'active', compliance: ['WRAP'], contactPerson: 'James O\'Connor', email: 'buy@primark.com', phone: '+353 1 888 0000' },
    { id: 'buy-4', name: 'Walmart Global Procurement', code: 'WMT', country: 'USA', paymentTerms: 'Net 60', creditLimit: 3000000, status: 'active', compliance: ['Walmart Ethical'], contactPerson: 'Sarah Chen', email: 'gp@walmart.com', phone: '+1 479 273 4000' },
    { id: 'buy-5', name: 'Uniqlo (Fast Retailing)', code: 'UNQ', country: 'Japan', paymentTerms: 'LC 30 Days', creditLimit: 1500000, status: 'active', compliance: ['GOTS'], contactPerson: 'Kenji Sato', email: 'vendor@uniqlo.com', phone: '+81 3 6865 0000' },
    { id: 'buy-6', name: 'Gap Inc.', code: 'GAP', country: 'USA', paymentTerms: 'Net 45', creditLimit: 900000, status: 'active', compliance: ['BSCI'], contactPerson: 'Emily Ross', email: 'sourcing@gap.com', phone: '+1 415 427 0100' },
    { id: 'buy-7', name: 'C&A Mode', code: 'CA', country: 'Germany', paymentTerms: 'TT 30 Days', creditLimit: 700000, status: 'prospect', compliance: [], contactPerson: 'Hans Mueller', email: 'buy@c-and-a.com', phone: '+49 211 0000' },
    { id: 'buy-8', name: 'Target Corporation', code: 'TGT', country: 'USA', paymentTerms: 'Net 60', creditLimit: 1100000, status: 'active', compliance: ['WRAP'], contactPerson: 'Lisa Park', email: 'gp@target.com', phone: '+1 612 304 6073' },
  ].map((b) => ({ ...b, companyId: 'co-1', createdAt: now(), updatedAt: now() }));

  const suppliers = Array.from({ length: 45 }, (_, i) => ({
    id: `sup-${i + 1}`,
    name: `${pick(['Apex', 'Delta', 'Pacific', 'Orient', 'Global', 'Prime', 'Nova'])} ${pick(['Textile', 'Yarn', 'Trims', 'Accessories', 'Packaging'])} Ltd`,
    code: `SUP-${String(i + 1).padStart(3, '0')}`,
    country: pick(['Bangladesh', 'China', 'India', 'Vietnam', 'Turkey']),
    materials: pick([['Fabric'], ['Buttons', 'Zippers'], ['Thread'], ['Labels'], ['Cartons'], ['Elastics']]),
    leadTimeDays: rand(7, 45),
    rating: rand(30, 50) / 10,
    apBalance: rand(0, 80000),
    status: 'active',
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const styles = Array.from({ length: 80 }, (_, i) => {
    const buyer = pick(buyers);
    return {
      id: `stl-${i + 1}`,
      styleNumber: `STL-${2000 + i}`,
      name: pick(['Slim Fit Polo', 'Crewneck Tee', 'Fleece Hoodie', 'Chino Shorts', 'Denim Jacket', 'Oxford Shirt', 'Jogger Pant', 'Kids Tee']),
      buyerId: buyer.id,
      buyer: buyer.name,
      season: pick(['SS26', 'AW26', 'SS27']),
      fabricSpec: pick(['Cotton Pique 220 GSM', 'Organic Jersey 180 GSM', 'Fleece 280 GSM', 'Denim 12oz', 'Poplin 120 GSM']),
      colors: pick([['Navy'], ['White', 'Black'], ['Heather Grey'], ['Olive', 'Sand'], ['Red', 'Blue', 'Green']]),
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      status: pick(['approved', 'sampling', 'production', 'archived']),
      unitCost: rand(4, 18),
      sellingPrice: rand(8, 35),
      bomRatio: {
        fabricMeters: rand(10, 25) / 10,
        buttons: rand(0, 8),
        threadCones: rand(1, 3) / 10,
        labels: 1,
      },
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const stages = ['cutting', 'printing', 'embroidery', 'sewing', 'washing', 'ironing', 'packing', 'shipment'];
  const orders = Array.from({ length: 180 }, (_, i) => {
    const buyer = pick(buyers);
    const style = pick(styles.filter((s) => s.buyerId === buyer.id).concat(styles));
    const qty = rand(2000, 50000);
    const unitPrice = style.sellingPrice;
    const status = pick(['Confirmed', 'In Production', 'Delayed', 'Completed', 'Shipped', 'Invoiced']);
    return {
      id: `ord-${i + 1}`,
      orderNumber: `SO-${1000 + i}`,
      buyerId: buyer.id,
      buyer: buyer.name,
      styleId: style.id,
      styleNumber: style.styleNumber,
      styleName: style.name,
      quantity: qty,
      unitPrice,
      totalValue: qty * unitPrice,
      currency: 'USD',
      stage: pick(stages),
      status,
      orderDate: daysAgo(rand(5, 200)).slice(0, 10),
      deliveryDate: daysAgo(-rand(10, 120)).slice(0, 10),
      sizeBreakdown: { XS: Math.floor(qty * 0.05), S: Math.floor(qty * 0.15), M: Math.floor(qty * 0.3), L: Math.floor(qty * 0.3), XL: Math.floor(qty * 0.15), XXL: Math.floor(qty * 0.05) },
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const inventory = Array.from({ length: 220 }, (_, i) => {
    const cat = pick(['Fabric', 'Trims', 'Accessories', 'Packaging', 'Finished Goods']);
    const stock = rand(0, 50000);
    const min = rand(1000, 8000);
    return {
      id: `inv-${i + 1}`,
      code: `SKU-${String(i + 1).padStart(4, '0')}`,
      name: `${pick(['Combed Cotton', 'Organic Jersey', 'Resin Button', 'YKK Zipper', 'Neck Label', 'Carton', 'Polybag', 'Finished Polo'])} ${i + 1}`,
      category: cat,
      warehouseId: pick(['br-3', 'br-1']),
      warehouse: pick(['CEPZ Warehouse', 'Factory Floor Store']),
      currentStock: stock,
      minAlertLevel: min,
      unit: pick(['Meters', 'Pcs', 'Cones', 'Cartons', 'Kg']),
      unitCost: rand(1, 120) / 10,
      status: stock < min * 0.3 ? 'Critical' : stock < min ? 'Low Stock' : 'In Stock',
      lastRestocked: daysAgo(rand(1, 60)).slice(0, 10),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const purchaseOrders = Array.from({ length: 120 }, (_, i) => {
    const sup = pick(suppliers);
    const total = rand(2000, 80000);
    return {
      id: `po-${i + 1}`,
      poNumber: `PO-2026-${800 + i}`,
      prNumber: `PR-${900 + i}`,
      supplierId: sup.id,
      supplier: sup.name,
      materials: [{ name: pick(inventory).name, qty: rand(500, 10000), unit: 'Meters', price: rand(2, 8) }],
      totalCost: total,
      status: pick(['Draft', 'PR Approved', 'PO Issued', 'Materials Received', 'Stock Updated', 'Payment Pending', 'Closed']),
      issueDate: daysAgo(rand(1, 90)).slice(0, 10),
      expectedDelivery: daysAgo(-rand(1, 30)).slice(0, 10),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const machines = Array.from({ length: 140 }, (_, i) => ({
    id: `mc-${i + 1}`,
    code: `MC-${String(i + 1).padStart(3, '0')}`,
    name: pick(['JUKI DDL-9000C', 'Brother S-7300A', 'Tajima Embroidery', 'Gerber Cutter', 'Kannegiesser Iron']),
    type: pick(['Lockstitch', 'Overlock', 'Embroidery', 'Cutting', 'Iron']),
    floorLocation: `Floor ${rand(1, 3)} - Line ${rand(1, 12)}`,
    status: pick(['Running', 'Running', 'Running', 'Under Maintenance', 'Idle']),
    efficiency: rand(70, 99),
    lastMaintenance: daysAgo(rand(1, 40)).slice(0, 10),
    nextMaintenance: daysAgo(-rand(1, 30)).slice(0, 10),
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const production = orders.filter((o) => ['In Production', 'Delayed', 'Confirmed'].includes(o.status)).slice(0, 80).map((o, i) => ({
    id: `prod-${i + 1}`,
    orderId: o.id,
    orderNumber: o.orderNumber,
    styleNumber: o.styleNumber,
    buyer: o.buyer,
    stage: o.stage,
    targetQty: o.quantity,
    completedQty: rand(0, o.quantity),
    efficiency: rand(70, 105),
    lineId: `L-${String(rand(1, 12)).padStart(2, '0')}`,
    supervisor: pick(employees).name,
    status: o.status,
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const attendance = Array.from({ length: 600 }, (_, i) => {
    const emp = pick(employees);
    return {
      id: `att-${i + 1}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: emp.name,
      date: daysAgo(rand(0, 30)).slice(0, 10),
      checkIn: `0${rand(7, 8)}:${rand(10, 59)}`,
      checkOut: `${rand(16, 18)}:${rand(10, 59)}`,
      method: pick(['Fingerprint', 'RFID', 'Face']),
      status: pick(['Present', 'Present', 'Late', 'Absent', 'Half Day']),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const leave = Array.from({ length: 80 }, (_, i) => {
    const emp = pick(employees);
    return {
      id: `leave-${i + 1}`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: pick(['Annual', 'Sick', 'Casual', 'Maternity', 'Unpaid']),
      from: daysAgo(-rand(1, 60)).slice(0, 10),
      to: daysAgo(-rand(1, 55)).slice(0, 10),
      days: rand(1, 7),
      status: pick(['Pending', 'Approved', 'Rejected']),
      reason: pick(['Family', 'Medical', 'Personal', 'Travel']),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const payroll = employees.filter((e) => e.status === 'active').slice(0, 450).map((emp, i) => {
    const basic = emp.salary;
    const ot = rand(0, 8000);
    const ded = Math.round(basic * 0.05);
    return {
      id: `pay-${i + 1}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: emp.name,
      period: '2026-07',
      basic,
      overtime: ot,
      allowances: rand(500, 3000),
      deductions: ded,
      netPay: basic + ot + rand(500, 3000) - ded,
      status: pick(['Draft', 'Approved', 'Paid']),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const shipments = orders.filter((o) => ['Shipped', 'Completed', 'Invoiced'].includes(o.status)).slice(0, 60).map((o, i) => ({
    id: `shp-${i + 1}`,
    shipmentNumber: `SHP-2026-${100 + i}`,
    orderId: o.id,
    orderNumber: o.orderNumber,
    buyer: o.buyer,
    containerNo: `CMAU${rand(100000, 999999)}`,
    port: pick(['BDCGP', 'ESVLC', 'ESBCN', 'USNYC']),
    etd: daysAgo(-rand(1, 40)).slice(0, 10),
    eta: daysAgo(-rand(20, 60)).slice(0, 10),
    status: pick(['Booked', 'Customs Cleared', 'In Transit', 'Delivered']),
    docs: ['Commercial Invoice', 'Packing List', 'COO', 'BL'],
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const invoices = shipments.map((s, i) => {
    const order = orders.find((o) => o.id === s.orderId)!;
    return {
      id: `inv-${i + 1}`,
      invoiceNumber: `INV-2026-${200 + i}`,
      orderId: order.id,
      shipmentId: s.id,
      buyerId: order.buyerId,
      buyer: order.buyer,
      amount: order.totalValue,
      currency: 'USD',
      status: pick(['Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue']),
      dueDate: daysAgo(-rand(10, 90)).slice(0, 10),
      paidAmount: 0,
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  invoices.forEach((inv) => {
    if (inv.status === 'Paid') inv.paidAmount = inv.amount;
    if (inv.status === 'Partially Paid') inv.paidAmount = Math.round(inv.amount * 0.5);
  });

  const qc = Array.from({ length: 200 }, (_, i) => {
    const order = pick(orders);
    return {
      id: `qc-${i + 1}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      gate: pick(['Cutting', 'Sewing Inline', 'Finishing', 'Final AQL']),
      inspector: pick(employees).name,
      inspectedQty: rand(100, 2000),
      defectQty: rand(0, 80),
      defectTypes: pick([['Stitch'], ['Spot'], ['Measurement'], ['Broken Stitch', 'Skip'], ['Shade']]),
      result: pick(['Pass', 'Pass', 'Fail', 'Rework']),
      aql: '2.5',
      date: daysAgo(rand(0, 45)).slice(0, 10),
      companyId: 'co-1',
      createdAt: now(),
      updatedAt: now(),
    };
  });

  const finance = {
    id: 'fin-summary',
    period: '2026-07',
    revenue: invoices.reduce((s, i) => s + i.paidAmount, 0),
    expenses: purchaseOrders.reduce((s, p) => s + (p.status === 'Closed' || p.status === 'Payment Pending' ? p.totalCost : 0), 0),
    receivables: invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + (i.amount - i.paidAmount), 0),
    payables: suppliers.reduce((s, x) => s + x.apBalance, 0),
    currency: 'USD',
    updatedAt: now(),
  };

  const expenses = Array.from({ length: 90 }, (_, i) => ({
    id: `exp-${i + 1}`,
    category: pick(['Utilities', 'Rent', 'Transport', 'Maintenance', 'Consumables', 'Compliance']),
    description: `Expense entry ${i + 1}`,
    amount: rand(100, 15000),
    date: daysAgo(rand(0, 90)).slice(0, 10),
    status: pick(['Approved', 'Pending', 'Paid']),
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const notifications = Array.from({ length: 100 }, (_, i) => ({
    id: `n-${i + 1}`,
    title: pick(['Low Stock Alert', 'Production Bottleneck', 'Shipment Clearance', 'Payroll Due', 'QC Fail', 'PO Delayed', 'Leave Request']),
    message: `Automated ERP alert #${i + 1} for factory operations.`,
    type: pick(['stock', 'production', 'shipment', 'payroll', 'qc', 'hr']),
    severity: pick(['high', 'medium', 'info']),
    read: Math.random() > 0.4,
    userId: pick(users).id,
    companyId: 'co-1',
    createdAt: daysAgo(rand(0, 14)),
    updatedAt: now(),
  }));

  const audit = Array.from({ length: 300 }, (_, i) => ({
    id: `aud-${i + 1}`,
    action: pick(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVE', 'EXPORT']),
    entity: pick(['Order', 'Employee', 'Inventory', 'PurchaseOrder', 'Invoice', 'User', 'Shipment']),
    entityId: randomUUID(),
    userId: pick(users).id,
    userName: pick(users).name,
    details: `Audit trail entry ${i + 1}`,
    ip: `192.168.1.${rand(2, 250)}`,
    companyId: 'co-1',
    createdAt: daysAgo(rand(0, 60)),
    updatedAt: now(),
  }));

  const warehouses = [
    { id: 'wh-1', branchId: 'br-3', name: 'CEPZ Raw Materials', code: 'RM-01', capacity: 50000, utilized: 32000, companyId: 'co-1', createdAt: now(), updatedAt: now() },
    { id: 'wh-2', branchId: 'br-1', name: 'Finished Goods Bay', code: 'FG-01', capacity: 20000, utilized: 8500, companyId: 'co-1', createdAt: now(), updatedAt: now() },
    { id: 'wh-3', branchId: 'br-1', name: 'Trims Store', code: 'TR-01', capacity: 10000, utilized: 4200, companyId: 'co-1', createdAt: now(), updatedAt: now() },
  ];

  const stockTransfers = Array.from({ length: 40 }, (_, i) => ({
    id: `st-${i + 1}`,
    transferNumber: `ST-2026-${i + 1}`,
    fromWarehouseId: pick(warehouses).id,
    toWarehouseId: pick(warehouses).id,
    itemId: pick(inventory).id,
    qty: rand(50, 2000),
    status: pick(['Draft', 'In Transit', 'Completed']),
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const leads = Array.from({ length: 35 }, (_, i) => ({
    id: `lead-${i + 1}`,
    companyName: `${pick(['Nordic', 'Atlantic', 'Sunrise', 'Metro'])} Fashion ${i + 1}`,
    contact: pick(firstNames) + ' ' + pick(lastNames),
    email: `lead${i + 1}@buyer.com`,
    country: pick(['UK', 'USA', 'Germany', 'UAE', 'Canada']),
    status: pick(['New', 'Contacted', 'Qualified', 'Quotation Sent', 'Won', 'Lost']),
    estimatedValue: rand(50000, 500000),
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const quotations = leads.filter((l) => ['Quotation Sent', 'Won'].includes(l.status)).map((l, i) => ({
    id: `qt-${i + 1}`,
    quotationNumber: `QT-2026-${i + 1}`,
    leadId: l.id,
    amount: l.estimatedValue,
    validUntil: daysAgo(-30).slice(0, 10),
    status: l.status === 'Won' ? 'Accepted' : 'Sent',
    companyId: 'co-1',
    createdAt: now(),
    updatedAt: now(),
  }));

  const settings = {
    id: 'settings-1',
    companyId: 'co-1',
    timezone: 'Asia/Dhaka',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    fiscalYearStart: '07-01',
    aqlDefault: '2.5',
    overtimeRate: 1.5,
    theme: 'system',
    modulesEnabled: roleDefs.map((r) => r.id),
    updatedAt: now(),
    createdAt: now(),
  };

  write('companies', companies);
  write('branches', branches);
  write('departments', departments);
  write('roles', roleDefs);
  write('users', users);
  write('employees', employees);
  write('buyers', buyers);
  write('suppliers', suppliers);
  write('styles', styles);
  write('orders', orders);
  write('inventory', inventory);
  write('purchase-orders', purchaseOrders);
  write('machines', machines);
  write('production', production);
  write('attendance', attendance);
  write('leave', leave);
  write('payroll', payroll);
  write('shipments', shipments);
  write('invoices', invoices);
  write('qc', qc);
  write('finance', [finance]);
  write('expenses', expenses);
  write('notifications', notifications);
  write('audit', audit);
  write('warehouses', warehouses);
  write('stock-transfers', stockTransfers);
  write('leads', leads);
  write('quotations', quotations);
  write('settings', [settings]);

  console.log('\nSeed complete. Default login: owner@garmentserp.com / Password@123');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
