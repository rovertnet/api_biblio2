// === src/books/books.module.ts ===
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './book.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { DownloadHistory } from '../history/download-history.entity';
import { ReadingHistory } from '../reading/reading-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, DownloadHistory, ReadingHistory]),
    SubscriptionsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}