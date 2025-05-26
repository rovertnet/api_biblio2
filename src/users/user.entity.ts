import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subscription } from '../subscriptions/subscription.entity';

export enum UserRole {
  USER = 'Visiteur',
  ADMIN = 'Admin',
  SUBSCRIBER = 'Abonne',
}
// The User entity represents a user in the system.
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
