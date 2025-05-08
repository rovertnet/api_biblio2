// === src/app.module.ts ===
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { typeOrmConfig } from './databases/typeorm.config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    BooksModule,
    SubscriptionsModule,
    CategoriesModule,
  ],
})
export class AppModule {}