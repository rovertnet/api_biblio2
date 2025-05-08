// === src/users/user.entity.ts ===
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Subscription } from '../subscriptions/subscription.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Subscription, (subscription) => subscription.user)
subscriptions: Subscription[];

}