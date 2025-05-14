// === src/subscriptions/subscriptions.module.ts ===
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller'; // ✅ Ajout ici
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User])],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController], // ✅ Enregistrement du contrôleur
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
