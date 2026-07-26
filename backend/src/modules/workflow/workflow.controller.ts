import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { CurrentUser } from '../../common/decorators/auth.decorators';

@ApiTags('workflow')
@ApiBearerAuth()
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflow: WorkflowService) {}

  @Post('purchase-orders/:id/advance')
  advancePo(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workflow.advancePurchaseOrder(id, user);
  }

  @Post('production/:id/advance')
  advanceProduction(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workflow.advanceProduction(id, user);
  }

  @Post('shipments/:id/invoice')
  invoiceShipment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workflow.createInvoiceFromShipment(id, user);
  }
}
