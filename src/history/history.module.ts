// === src/history/history.module.ts ===
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadHistory } from './download-history.entity';
import { ReadingHistory } from '../reading/reading-history.entity';
import { AdminHistoryController } from './admin-history.controller';
import { AdminHistoryService } from './admin-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadHistory, ReadingHistory])],
  controllers: [AdminHistoryController],
  providers: [AdminHistoryService],
})
export class HistoryModule {}
