import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReadingHistoryService } from './reading-history.service';

@Controller('reading-history')
@UseGuards(JwtAuthGuard)
export class ReadingHistoryController {
  constructor(private historyService: ReadingHistoryService) {}

  @Get()
  async getMyHistory(@Req() req) {
    const userId = req.user.sub;
    return this.historyService.getHistoryForUser(userId);
  }
}
