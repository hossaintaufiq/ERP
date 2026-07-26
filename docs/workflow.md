# Garments Workflow

```
Lead → Buyer → Quotation → Sales Order → BOM
  → Raw Material PO → Warehouse GRN → Production Planning
  → Cutting → Sewing → Printing/Embroidery → Washing
  → Finishing/Ironing → QC → Packing → Shipment
  → Invoice → Payment
```

## Implemented side effects

### Advance Purchase Order
`POST /api/workflow/purchase-orders/:id/advance`

1. Moves PO along lifecycle  
2. On receive/stock update → increments inventory  
3. Creates notification  
4. Writes audit log  

### Advance Production
`POST /api/workflow/production/:id/advance`

1. Moves job to next of 8 stages  
2. Syncs related sales order stage  
3. Notification + audit  

### Invoice from Shipment
`POST /api/workflow/shipments/:id/invoice`

1. Creates invoice from order value  
2. Marks order `Invoiced`  
3. Notification  

## Stage codes

`cutting | printing | embroidery | sewing | washing | ironing | packing | shipment`
