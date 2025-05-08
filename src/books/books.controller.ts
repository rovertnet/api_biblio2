// === src/books/books.controller.ts ===
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';
import { Request } from 'express';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/read')
  async read(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const isSubscribed = await this.subscriptionsService.isUserSubscribed(user.userId);

    if (!isSubscribed) {
      return { message: 'Vous devez être abonné pour accéder à ce livre.' };
    }

    return this.booksService.read(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async download(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const canDownload = await this.subscriptionsService.canDownload(user.userId);

    if (!canDownload) {
      return { message: 'Téléchargement non autorisé ou limite atteinte.' };
    }

    await this.subscriptionsService.registerDownload(user.userId);
    return this.booksService.download(+id);
  }
}