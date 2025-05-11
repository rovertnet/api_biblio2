import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingHistory } from './reading-history.entity';

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectRepository(ReadingHistory)
    private historyRepo: Repository<ReadingHistory>,
  ) {}

  async logReading(userId: number, bookId: number) {
    const history = this.historyRepo.create({
      userId,
      bookId,
      startedAt: new Date(),
    });
    return this.historyRepo.save(history);
  }

  async getHistoryForUser(userId: number) {
    return this.historyRepo.find({
      where: { userId },
      relations: ['book'],
      order: { startedAt: 'DESC' },
    });
  }
}
