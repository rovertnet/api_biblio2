// === src/subscriptions/subscription.entity.ts ===
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: 0 })
  downloadsUsed: number;

  @Column()
  type: 'monthly' | 'semiannual' | 'annual';

  isActive(): boolean {
    const today = new Date();
    return this.startDate <= today && this.endDate >= today;
  }

  incrementDownloads(): void {
    this.downloadsUsed++;
  }
}