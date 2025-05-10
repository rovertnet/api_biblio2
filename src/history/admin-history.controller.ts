// === src/history/admin-history.controller.ts ===
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminHistoryService } from './admin-history.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';
import { RolesGuard } from '../cammon/guards/roles.guard';
import { Roles } from '../cammon/decorators/roles.decorator';

@Controller('admin/history')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminHistoryController {
  constructor(private readonly adminHistoryService: AdminHistoryService) {}

  @Get('downloads')
  getAllDownloads(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.adminHistoryService.getAllDownloads(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('readings')
  getAllReadings(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.adminHistoryService.getAllReadings(
      parseInt(page),
      parseInt(limit),
    );
  }
}
