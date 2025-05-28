// === src/books/books.controller.ts ===
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  Req,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';
import { RolesGuard } from '../cammon/guards/roles.guard';
import { Roles } from '../cammon/decorators/roles.decorator';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Response, Request } from 'express';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllBooks(
    @Query('page') page = '1',
    @Query('limit') limit = '8',
    @Query('keyword') keyword = '',
    @Query('categoryId') categoryId?: string,
    @Query('sortBy') sortBy: 'title' | 'author' | 'createdAt' = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.booksService.findAll(
      keyword,
      categoryId ? parseInt(categoryId) : undefined,
      parseInt(page),
      parseInt(limit),
      sortBy,
      sortOrder,
    );
  }

  @Get('categories/:id/books')
  findBooksByCategory(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy = 'title',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.booksService.findBooksByCategory(+id, {
      page: +page,
      limit: +limit,
      search,
      sortBy,
      order,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { id: number };
    await this.subscriptionsService.enforceDownloadAccess(user.id);
    const file = await this.booksService.download(id);
    await this.subscriptionsService.registerDownload(user.id);
    await this.booksService.logDownload(user.id, id); // Log into history
    return file;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.saveUploadedBook(file, createBookDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('books')
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async logReading(
    @Param('id', ParseIntPipe) bookId: number,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    return this.booksService.logReading(user.id, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('readings')
  async getUserReadings(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '8',
  ) {
    const user = req.user as { id: number };
    return this.booksService.getReadingsByUser(user.id, parseInt(page), parseInt(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get('downloads')
  async getUserDownloads(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '8',
  ) {
    const user = req.user as { id: number };
    return this.booksService.getDownloadsByUser(user.id, parseInt(page), parseInt(limit));
  }
}
