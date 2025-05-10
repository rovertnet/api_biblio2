// === src/reading/reading-history.entity.ts ===
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity('reading_history')
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Book)
  book: Book;
}
