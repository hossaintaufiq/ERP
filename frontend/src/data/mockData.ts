export interface Buyer {
  id: string;
  name: string;
  code: string;
  country: string;
  logo: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  paymentTerms: string;
  outstandingBalance: number;
  documents: { title: string; date: string; size: string }[];
}

export interface SalesOrder {
  orderNumber: string;
  buyer: string;
  styleNumber: string;
  productName: string;
  category: string;
  color: string;
  sizeBreakdown: { S: number; M: number; L: number; XL: number; XXL: number };
  totalQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'In Production' | 'Cutting' | 'Sewing' | 'QC Inspection' | 'Packing' | 'Shipped' | 'Delayed';
  progress: number;
}

export interface StyleProduct {
  styleNumber: string;
  name: string;
  category: string;
  buyer: string;
  season: string;
  fabricSpec: string;
  accessories: string[];
  colors: string[];
  sizes: string[];
  techPackUrl: string;
  image: string;
  bomRatio: {
    material: string;
    category: 'Fabric' | 'Accessories' | 'Trims' | 'Packaging';
    consumptionPerPiece: number;
    unit: string;
    unitPrice: number;
  }[];
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Fabric' | 'Trims' | 'Accessories' | 'Packaging' | 'Chemicals' | 'Finished Goods';
  warehouse: string;
  currentStock: number;
  minAlertLevel: number;
  unit: string;
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Critical' | 'Overstocked';
  lastRestocked: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  materialsSupplied: string[];
  rating: number; // 1 to 5
  leadTimeDays: number;
  outstandingPayment: number;
  paymentTerms: string;
  cityCountry: string;
}

export interface PurchaseOrder {
  poNumber: string;
  prNumber: string;
  supplier: string;
  materials: { name: string; qty: number; unit: string; price: number }[];
  totalCost: number;
  issueDate: string;
  expectedDelivery: string;
  status: 'Draft' | 'PR Approved' | 'PO Issued' | 'Materials Received' | 'Paid';
}

export interface ProductionPipelineStage {
  id: string;
  name: string;
  color: string;
  activeOrdersCount: number;
  dailyTargetPcs: number;
  actualCompletedPcs: number;
  efficiencyPercent: number;
}

export interface LineTracking {
  lineId: string;
  lineName: string;
  buyer: string;
  styleNumber: string;
  targetDaily: number;
  actualDaily: number;
  efficiency: number;
  rejections: number;
  rework: number;
  machineCount: number;
  supervisor: string;
  status: 'Optimal' | 'Behind Schedule' | 'Critical Delay';
}

export interface QCInspection {
  id: string;
  stage: 'Cutting QC' | 'Sewing QC' | 'Finishing QC' | 'Final QC';
  orderNumber: string;
  inspectorName: string;
  inspectedQty: number;
  passedQty: number;
  defectiveQty: number;
  defectTypes: { type: string; count: number }[];
  scorePercent: number;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeCode: string;
  department: 'Cutting' | 'Sewing' | 'Finishing' | 'Quality' | 'Maintenance' | 'Store' | 'HR & Admin' | 'Accounts';
  designation: string;
  salary: number;
  shift: 'Day Shift (8am-5pm)' | 'Night Shift (8pm-5am)';
  joiningDate: string;
  phone: string;
  attendanceRate: number;
  performanceScore: number;
  avatar: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  type: 'Single Needle Lockstitch' | 'Overlock 5-Thread' | 'Auto Cutting Machine' | 'Embroidery 12-Head' | 'Button Hole' | 'Steam Iron Press';
  floorLocation: string;
  operatorAssigned: string;
  status: 'Running' | 'Idle' | 'Under Maintenance' | 'Breakdown';
  efficiency: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface ShipmentRecord {
  id: string;
  shipmentCode: string;
  orderNumber: string;
  buyer: string;
  containerNumber: string;
  courier: string;
  trackingNumber: string;
  shipmentDate: string;
  portOfLoading: string;
  destinationPort: string;
  totalCartons: number;
  totalGrossWeightKg: number;
  status: 'Scheduled' | 'Customs Cleared' | 'In Transit' | 'Delivered';
  invoiceAmount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'stock' | 'production' | 'shipment' | 'payroll' | 'machine';
  severity: 'high' | 'medium' | 'info';
  read: boolean;
}

// Data store
export const MOCK_BUYERS: Buyer[] = [
  {
    id: 'b1',
    name: 'Zara (Inditex)',
    code: 'BUY-ZARA',
    country: 'Spain',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=100&auto=format&fit=crop&q=80',
    contactPerson: 'Elena Rostova',
    email: 'elena.r@inditex.com',
    phone: '+34 981 185 400',
    totalOrders: 42,
    totalRevenue: 1480000,
    activeOrders: 5,
    paymentTerms: 'LC 60 Days',
    outstandingBalance: 145000,
    documents: [
      { title: 'Master_Vendor_Agreement_2026.pdf', date: '2026-01-10', size: '2.4 MB' },
      { title: 'Social_Compliance_Audit_A+.pdf', date: '2026-03-15', size: '4.1 MB' },
    ],
  },
  {
    id: 'b2',
    name: 'H&M Hennes & Mauritz',
    code: 'BUY-HM',
    country: 'Sweden',
    logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=100&auto=format&fit=crop&q=80',
    contactPerson: 'Marcus Lindqvist',
    email: 'm.lindqvist@hm.com',
    phone: '+46 8 796 5500',
    totalOrders: 68,
    totalRevenue: 2850000,
    activeOrders: 8,
    paymentTerms: 'TT 45 Days',
    outstandingBalance: 210000,
    documents: [
      { title: 'HM_Code_Of_Conduct_Cert.pdf', date: '2026-02-01', size: '1.8 MB' },
      { title: 'OEKO_TEX_Standard100.pdf', date: '2026-04-20', size: '3.2 MB' },
    ],
  },
  {
    id: 'b3',
    name: 'Primark Stores Ltd',
    code: 'BUY-PRIMARK',
    country: 'United Kingdom',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80',
    contactPerson: 'David O\'Connor',
    email: 'doconnor@primark.co.uk',
    phone: '+44 118 960 6000',
    totalOrders: 35,
    totalRevenue: 980000,
    activeOrders: 3,
    paymentTerms: 'LC 90 Days',
    outstandingBalance: 85000,
    documents: [
      { title: 'Primark_Quality_Standard_V4.pdf', date: '2025-11-12', size: '1.5 MB' },
    ],
  },
  {
    id: 'b4',
    name: 'Walmart Global Procurement',
    code: 'BUY-WALMART',
    country: 'United States',
    logo: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=100&auto=format&fit=crop&q=80',
    contactPerson: 'Sarah Jenkins',
    email: 'sjenkins@walmart.com',
    phone: '+1 479 273 4000',
    totalOrders: 54,
    totalRevenue: 3420000,
    activeOrders: 6,
    paymentTerms: 'LC 30 Days',
    outstandingBalance: 320000,
    documents: [
      { title: 'Walmart_Sourcing_Contract_2026.pdf', date: '2026-01-05', size: '5.1 MB' },
    ],
  },
];

export const MOCK_ORDERS: SalesOrder[] = [
  {
    orderNumber: 'SO-1023',
    buyer: 'Zara (Inditex)',
    styleNumber: 'STL-9920',
    productName: 'Premium Slim Fit Polo Shirt',
    category: 'Polo Shirt',
    color: 'Navy Blue',
    sizeBreakdown: { S: 1000, M: 2000, L: 1200, XL: 600, XXL: 200 },
    totalQuantity: 5000,
    unitPrice: 4.50,
    totalAmount: 22500,
    orderDate: '2026-07-01',
    deliveryDate: '2026-08-25',
    status: 'In Production',
    progress: 68,
  },
  {
    orderNumber: 'SO-1024',
    buyer: 'H&M Hennes & Mauritz',
    styleNumber: 'STL-4412',
    productName: 'Organic Cotton Crewneck T-Shirt',
    category: 'T-Shirt',
    color: 'White',
    sizeBreakdown: { S: 2500, M: 4000, L: 2500, XL: 1000, XXL: 0 },
    totalQuantity: 10000,
    unitPrice: 3.20,
    totalAmount: 32000,
    orderDate: '2026-07-05',
    deliveryDate: '2026-09-05',
    status: 'Cutting',
    progress: 35,
  },
  {
    orderNumber: 'SO-1025',
    buyer: 'Primark Stores Ltd',
    styleNumber: 'STL-1108',
    productName: 'Basic Fleece Hooded Sweatshirt',
    category: 'Hoodie',
    color: 'Heather Gray',
    sizeBreakdown: { S: 500, M: 1200, L: 1500, XL: 800, XXL: 0 },
    totalQuantity: 4000,
    unitPrice: 8.75,
    totalAmount: 35000,
    orderDate: '2026-06-20',
    deliveryDate: '2026-08-10',
    status: 'Delayed',
    progress: 82,
  },
  {
    orderNumber: 'SO-1026',
    buyer: 'Walmart Global Procurement',
    styleNumber: 'STL-7731',
    productName: 'Stretch Twill Cargo Chino Shorts',
    category: 'Bottoms',
    color: 'Khaki',
    sizeBreakdown: { S: 1500, M: 3000, L: 2500, XL: 1000, XXL: 0 },
    totalQuantity: 8000,
    unitPrice: 6.80,
    totalAmount: 54400,
    orderDate: '2026-07-10',
    deliveryDate: '2026-09-20',
    status: 'Sewing',
    progress: 45,
  },
  {
    orderNumber: 'SO-1027',
    buyer: 'Zara (Inditex)',
    styleNumber: 'STL-8801',
    productName: 'Washed Denim Oversized Jacket',
    category: 'Jacket',
    color: 'Vintage Blue',
    sizeBreakdown: { S: 600, M: 1000, L: 800, XL: 400, XXL: 200 },
    totalQuantity: 3000,
    unitPrice: 16.50,
    totalAmount: 49500,
    orderDate: '2026-06-15',
    deliveryDate: '2026-08-18',
    status: 'QC Inspection',
    progress: 90,
  },
];

export const MOCK_STYLES: StyleProduct[] = [
  {
    styleNumber: 'STL-9920',
    name: 'Premium Slim Fit Polo Shirt',
    category: 'Polo Shirt',
    buyer: 'Zara (Inditex)',
    season: 'Autumn/Winter 2026',
    fabricSpec: '100% Combed Cotton Pique 220 GSM',
    accessories: ['5 Engraved Resin Buttons', 'Ribbed Collar', 'Custom Neck Label', 'Poly Bag'],
    colors: ['Navy Blue', 'Burgundy', 'Emerald Green', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    techPackUrl: 'TP-STL-9920-V3.pdf',
    image: 'https://images.unsplash.com/photo-1625910513413-562725e1a74d?w=500&auto=format&fit=crop&q=80',
    bomRatio: [
      { material: 'Pique Cotton Fabric 220 GSM', category: 'Fabric', consumptionPerPiece: 1.8, unit: 'Meters', unitPrice: 3.40 },
      { material: 'Custom Brand Buttons 14mm', category: 'Trims', consumptionPerPiece: 5, unit: 'Pcs', unitPrice: 0.08 },
      { material: 'Rib Knit Collar & Cuff Set', category: 'Trims', consumptionPerPiece: 1, unit: 'Set', unitPrice: 0.65 },
      { material: 'High-Tenacity Polyester Thread', category: 'Accessories', consumptionPerPiece: 80, unit: 'Meters', unitPrice: 0.005 },
      { material: 'Zara Printed Hang Tag', category: 'Packaging', consumptionPerPiece: 1, unit: 'Pcs', unitPrice: 0.12 },
      { material: 'Self-Adhesive Poly Bag', category: 'Packaging', consumptionPerPiece: 1, unit: 'Pcs', unitPrice: 0.05 },
      { material: 'Woven Brand Neck Label', category: 'Trims', consumptionPerPiece: 1, unit: 'Pcs', unitPrice: 0.09 },
    ],
  },
  {
    styleNumber: 'STL-4412',
    name: 'Organic Cotton Crewneck T-Shirt',
    category: 'T-Shirt',
    buyer: 'H&M Hennes & Mauritz',
    season: 'Spring/Summer 2026',
    fabricSpec: '100% GOTS Organic Cotton Jersey 180 GSM',
    accessories: ['1x1 Rib Neckband', 'Care Label', 'Recycled Poly Bag'],
    colors: ['White', 'Black', 'Sage Green', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    techPackUrl: 'TP-STL-4412-V2.pdf',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    bomRatio: [
      { material: 'Organic Single Jersey 180 GSM', category: 'Fabric', consumptionPerPiece: 1.3, unit: 'Meters', unitPrice: 2.80 },
      { material: '1x1 Rib Neck Ribbing', category: 'Fabric', consumptionPerPiece: 0.15, unit: 'Meters', unitPrice: 2.20 },
      { material: 'Sewing Thread 40/2 White', category: 'Accessories', consumptionPerPiece: 60, unit: 'Meters', unitPrice: 0.004 },
      { material: 'H&M Eco Care Label', category: 'Trims', consumptionPerPiece: 1, unit: 'Pcs', unitPrice: 0.04 },
      { material: 'Recycled Poly Bag', category: 'Packaging', consumptionPerPiece: 1, unit: 'Pcs', unitPrice: 0.04 },
    ],
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', code: 'FAB-CTN-220', name: 'Combed Cotton Pique 220 GSM (Navy)', category: 'Fabric', warehouse: 'Warehouse A - Bay 12', currentStock: 14500, minAlertLevel: 5000, unit: 'Meters', unitCost: 3.40, status: 'In Stock', lastRestocked: '2026-07-15' },
  { id: 'inv-2', code: 'FAB-ORG-180', name: 'GOTS Organic Cotton Jersey (White)', category: 'Fabric', warehouse: 'Warehouse A - Bay 08', currentStock: 4200, minAlertLevel: 8000, unit: 'Meters', unitCost: 2.80, status: 'Low Stock', lastRestocked: '2026-07-02' },
  { id: 'inv-3', code: 'TRM-BTN-14', name: 'Custom Resin Button 14mm (4-Hole)', category: 'Trims', warehouse: 'Warehouse B - Shelf 04', currentStock: 85000, minAlertLevel: 20000, unit: 'Pcs', unitCost: 0.08, status: 'In Stock', lastRestocked: '2026-07-10' },
  { id: 'inv-4', code: 'TRM-LBL-ZR', name: 'Zara Woven Main Neck Label', category: 'Trims', warehouse: 'Warehouse B - Shelf 02', currentStock: 3200, minAlertLevel: 10000, unit: 'Pcs', unitCost: 0.09, status: 'Critical', lastRestocked: '2026-06-25' },
  { id: 'inv-5', code: 'PKG-CART-L', name: 'Master Export Corrugated Carton (5-Ply)', category: 'Packaging', warehouse: 'Warehouse C - Floor', currentStock: 1200, minAlertLevel: 500, unit: 'Cartons', unitCost: 1.85, status: 'In Stock', lastRestocked: '2026-07-18' },
  { id: 'inv-6', code: 'ACC-THRD-50', name: 'Core Spun Poly Sewing Thread 50/2 (Navy)', category: 'Accessories', warehouse: 'Warehouse B - Shelf 09', currentStock: 450, minAlertLevel: 100, unit: 'Cones', unitCost: 4.20, status: 'In Stock', lastRestocked: '2026-07-12' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', companyName: 'Apex Textile Mills Ltd', contactPerson: 'Kamrul Hasan', phone: '+880 1711 900800', email: 'sales@apextextiles.com', materialsSupplied: ['Cotton Pique', 'Single Jersey', 'French Terry'], rating: 4.8, leadTimeDays: 14, outstandingPayment: 42000, paymentTerms: '30 Days Net', cityCountry: 'Dhaka, Bangladesh' },
  { id: 'sup-2', companyName: 'YKK Fastening Accessories', contactPerson: 'Takahiro Mori', phone: '+880 2 9887711', email: 'orders@ykk.bd.com', materialsSupplied: ['Zippers', 'Metal Buttons', 'Rivets'], rating: 4.9, leadTimeDays: 7, outstandingPayment: 18500, paymentTerms: '15 Days Net', cityCountry: 'Chittagong, Bangladesh' },
  { id: 'sup-3', companyName: 'Coats Thread Bangladesh', contactPerson: 'Shayan Ahmed', phone: '+880 1819 223344', email: 'shayan.a@coats.com', materialsSupplied: ['Sewing Thread', 'Embroidery Floss'], rating: 4.6, leadTimeDays: 5, outstandingPayment: 6200, paymentTerms: 'Immediate', cityCountry: 'Gazipur, Bangladesh' },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { poNumber: 'PO-2026-881', prNumber: 'PR-904', supplier: 'Apex Textile Mills Ltd', materials: [{ name: 'Combed Cotton Pique 220 GSM Navy', qty: 9000, unit: 'Meters', price: 3.40 }], totalCost: 30600, issueDate: '2026-07-02', expectedDelivery: '2026-07-18', status: 'Materials Received' },
  { poNumber: 'PO-2026-882', prNumber: 'PR-905', supplier: 'YKK Fastening Accessories', materials: [{ name: 'Custom Resin Button 14mm', qty: 25000, unit: 'Pcs', price: 0.08 }], totalCost: 2000, issueDate: '2026-07-08', expectedDelivery: '2026-07-25', status: 'PO Issued' },
];

export const MOCK_PIPELINE_STAGES: ProductionPipelineStage[] = [
  { id: 'cutting', name: 'Cutting', color: '#ec4899', activeOrdersCount: 4, dailyTargetPcs: 8000, actualCompletedPcs: 7850, efficiencyPercent: 98.1 },
  { id: 'printing', name: 'Printing', color: '#8b5cf6', activeOrdersCount: 2, dailyTargetPcs: 5000, actualCompletedPcs: 4900, efficiencyPercent: 98.0 },
  { id: 'embroidery', name: 'Embroidery', color: '#a855f7', activeOrdersCount: 1, dailyTargetPcs: 2500, actualCompletedPcs: 2350, efficiencyPercent: 94.0 },
  { id: 'sewing', name: 'Sewing Floor', color: '#3b82f6', activeOrdersCount: 6, dailyTargetPcs: 12000, actualCompletedPcs: 10650, efficiencyPercent: 88.75 },
  { id: 'washing', name: 'Washing Unit', color: '#06b6d4', activeOrdersCount: 2, dailyTargetPcs: 4000, actualCompletedPcs: 4100, efficiencyPercent: 102.5 },
  { id: 'ironing', name: 'Iron & Press', color: '#10b981', activeOrdersCount: 5, dailyTargetPcs: 10000, actualCompletedPcs: 9800, efficiencyPercent: 98.0 },
  { id: 'packing', name: 'Packing', color: '#f59e0b', activeOrdersCount: 4, dailyTargetPcs: 9500, actualCompletedPcs: 9100, efficiencyPercent: 95.7 },
  { id: 'shipment', name: 'Shipment Bay', color: '#6366f1', activeOrdersCount: 3, dailyTargetPcs: 8000, actualCompletedPcs: 8000, efficiencyPercent: 100.0 },
];

export const MOCK_LINE_TRACKING: LineTracking[] = [
  { lineId: 'L-01', lineName: 'Sewing Line 01 (Polo)', buyer: 'Zara', styleNumber: 'STL-9920', targetDaily: 1200, actualDaily: 1150, efficiency: 95.8, rejections: 18, rework: 24, machineCount: 32, supervisor: 'Rafiqul Islam', status: 'Optimal' },
  { lineId: 'L-02', lineName: 'Sewing Line 02 (T-Shirt)', buyer: 'H&M', styleNumber: 'STL-4412', targetDaily: 1800, actualDaily: 1420, efficiency: 78.8, rejections: 45, rework: 62, machineCount: 38, supervisor: 'Farhana Parvin', status: 'Behind Schedule' },
  { lineId: 'L-03', lineName: 'Sewing Line 03 (Jacket)', buyer: 'Zara', styleNumber: 'STL-8801', targetDaily: 600, actualDaily: 580, efficiency: 96.6, rejections: 8, rework: 12, machineCount: 28, supervisor: 'Kabir Hossain', status: 'Optimal' },
  { lineId: 'L-04', lineName: 'Sewing Line 04 (Bottoms)', buyer: 'Walmart', styleNumber: 'STL-7731', targetDaily: 1400, actualDaily: 1100, efficiency: 74.2, rejections: 52, rework: 80, machineCount: 35, supervisor: 'Anisur Rahman', status: 'Critical Delay' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-101', name: 'MD. Tariqul Islam', employeeCode: 'RG-EMP-101', department: 'Sewing', designation: 'Senior Line Master', salary: 38000, shift: 'Day Shift (8am-5pm)', joiningDate: '2021-03-15', phone: '+880 1712 345678', attendanceRate: 98.4, performanceScore: 94, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'emp-102', name: 'Nusrat Jahan', employeeCode: 'RG-EMP-102', department: 'Quality', designation: 'Lead QC Inspector', salary: 34000, shift: 'Day Shift (8am-5pm)', joiningDate: '2022-01-10', phone: '+880 1819 876543', attendanceRate: 99.1, performanceScore: 96, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'emp-103', name: 'Shahadat Hossain', employeeCode: 'RG-EMP-103', department: 'Cutting', designation: 'Automatic Spreader Operator', salary: 28000, shift: 'Day Shift (8am-5pm)', joiningDate: '2023-05-20', phone: '+880 1911 223344', attendanceRate: 96.5, performanceScore: 89, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'emp-104', name: 'Ayesha Siddiqua', employeeCode: 'RG-EMP-104', department: 'HR & Admin', designation: 'HR Officer', salary: 42000, shift: 'Day Shift (8am-5pm)', joiningDate: '2020-08-01', phone: '+880 1612 998877', attendanceRate: 100, performanceScore: 98, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'emp-105', name: 'Mahbub Alam', employeeCode: 'RG-EMP-105', department: 'Maintenance', designation: 'Chief Electro-Mechanical Tech', salary: 45000, shift: 'Day Shift (8am-5pm)', joiningDate: '2019-11-12', phone: '+880 1715 443322', attendanceRate: 97.8, performanceScore: 92, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
];

export const MOCK_MACHINES: Machine[] = [
  { id: 'm-01', code: 'MC-JUK-01', name: 'JUKI DDL-9000C Direct Drive Lockstitch', type: 'Single Needle Lockstitch', floorLocation: 'Floor 2 - Line 1', operatorAssigned: 'Tariqul Islam', status: 'Running', efficiency: 96.5, lastMaintenance: '2026-07-01', nextMaintenance: '2026-08-01' },
  { id: 'm-02', code: 'MC-BRO-04', name: 'Brother S-7300A Nexio Lockstitch', type: 'Single Needle Lockstitch', floorLocation: 'Floor 2 - Line 2', operatorAssigned: 'Salma Begum', status: 'Running', efficiency: 91.2, lastMaintenance: '2026-06-20', nextMaintenance: '2026-07-20' },
  { id: 'm-03', code: 'MC-TAJ-01', name: 'Tajima 12-Head Automatic Embroidery', type: 'Embroidery 12-Head', floorLocation: 'Floor 1 - Embroidery Section', operatorAssigned: 'Monir Khan', status: 'Under Maintenance', efficiency: 82.0, lastMaintenance: '2026-07-22', nextMaintenance: '2026-07-29' },
  { id: 'm-04', code: 'MC-GER-01', name: 'Gerber Technology Paragon Auto Cutter', type: 'Auto Cutting Machine', floorLocation: 'Floor 1 - Cutting Bay', operatorAssigned: 'Shahadat Hossain', status: 'Running', efficiency: 98.4, lastMaintenance: '2026-07-10', nextMaintenance: '2026-08-10' },
];

export const MOCK_SHIPMENTS: ShipmentRecord[] = [
  { id: 'shp-901', shipmentCode: 'EXP-2026-901', orderNumber: 'SO-1023', buyer: 'Zara (Inditex)', containerNumber: 'MSKU-982314-8', courier: 'Maersk Logistics', trackingNumber: 'MAEU-99482103', shipmentDate: '2026-08-25', portOfLoading: 'Chittagong Port (BDCGP)', destinationPort: 'Valencia Port (ESVLC)', totalCartons: 250, totalGrossWeightKg: 1850, status: 'Scheduled', invoiceAmount: 22500 },
  { id: 'shp-902', shipmentCode: 'EXP-2026-902', orderNumber: 'SO-1027', buyer: 'Zara (Inditex)', containerNumber: 'CMAU-441209-1', courier: 'CMA CGM', trackingNumber: 'CMA-8812903', shipmentDate: '2026-08-18', portOfLoading: 'Chittagong Port (BDCGP)', destinationPort: 'Barcelona Port (ESBCN)', totalCartons: 180, totalGrossWeightKg: 2100, status: 'Customs Cleared', invoiceAmount: 49500 },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Low Stock Alert', message: 'Zara Woven Main Neck Label is below critical safety threshold (3,200 pcs remaining).', timestamp: '10 minutes ago', type: 'stock', severity: 'high', read: false },
  { id: 'n2', title: 'Production Bottleneck', message: 'Sewing Line 04 (Walmart Shorts) efficiency dropped to 74.2% due to needle thread tension fault.', timestamp: '42 minutes ago', type: 'production', severity: 'high', read: false },
  { id: 'n3', title: 'Shipment Clearance Approved', message: 'Customs documents cleared for Container CMAU-441209-1 (Zara Order #SO-1027).', timestamp: '2 hours ago', type: 'shipment', severity: 'info', read: true },
  { id: 'n4', title: 'Monthly Salary Disbursement Due', message: 'July 2026 Payroll for 450 factory operators requires executive approval.', timestamp: '3 hours ago', type: 'payroll', severity: 'medium', read: false },
  { id: 'n5', title: 'Machine Maintenance Due', message: 'Tajima 12-Head Embroidery (MC-TAJ-01) scheduled for weekly calibration today.', timestamp: '5 hours ago', type: 'machine', severity: 'medium', read: true },
];

export const MOCK_USER_ROLES = [
  { id: 'owner', name: 'Owner / Managing Director', badge: 'Full Access', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  { id: 'gm', name: 'General Manager', badge: 'Executive Access', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  { id: 'prod_mgr', name: 'Production Manager', badge: 'Floor Operations', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'store_mgr', name: 'Store & Inventory Manager', badge: 'Warehouse Access', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'hr', name: 'HR & Payroll Manager', badge: 'Personnel Access', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'accounts', name: 'Finance & Accounts', badge: 'Financial Ledgers', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
  { id: 'qc', name: 'QC Inspector / Lead', badge: 'Quality Gate', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
  { id: 'sales', name: 'Sales & Merchandising', badge: 'Commercial Desk', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
  { id: 'operator', name: 'Shop Floor Operator', badge: 'Line View Only', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
];
