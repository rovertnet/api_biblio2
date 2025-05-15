import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';
import { Category } from '../categories/category.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { ReadingHistory } from '../reading/reading-history.entity';
import { DownloadHistory } from 'src/history/download-history.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'bibliotheque',
  entities: [User, Book, Category, Subscription, ReadingHistory, DownloadHistory],
  synchronize: true, // à activer uniquement en dev
};
