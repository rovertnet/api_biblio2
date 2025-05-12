// === src/books/book.entity.ts ===
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('text')
  description: string;

  @Column()
  fileUrl: string;

  @Column({ default: 0 })
  totalPages: number;

  @Column({ nullable: true })
  fileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.books, { eager: true })
  category: Category;
}
