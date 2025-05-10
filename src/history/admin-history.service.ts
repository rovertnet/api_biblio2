// === src/history/admin-history.service.ts ===
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DownloadHistory } from './download-history.entity';
import { ReadingHistory } from '../reading/reading-history.entity';

@Injectable()
export class AdminHistoryService {
  constructor(
    @InjectRepository(DownloadHistory)
    private readonly downloadRepo: Repository<DownloadHistory>,

    @InjectRepository(ReadingHistory)
    private readonly readingRepo: Repository<ReadingHistory>,
  ) {}

  async getAllDownloads(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.downloadRepo.findAndCount({
      relations: ['user', 'book'],
      order: { downloadedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllReadings(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.readingRepo.findAndCount({
      relations: ['user', 'book'],
      order: { startedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
