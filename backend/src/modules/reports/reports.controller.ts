import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get(':type')
  generate(@Param('type') type: string, @Query('timeline') timeline?: string) {
    return this.reports.generate(type, timeline || 'Monthly');
  }

  @Get(':type/export')
  @Header('Content-Type', 'text/csv')
  export(@Param('type') type: string) {
    return this.reports.exportCsv(type);
  }
}
