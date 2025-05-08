// === src/subscriptions/dto/create-subscription.dto.ts ===
import { IsIn } from 'class-validator';

export class CreateSubscriptionDto {
  @IsIn(['monthly', 'semiannual', 'annual'], {
    message: 'Type must be one of: monthly, semiannual, annual',
  })
  type: 'monthly' | 'semiannual' | 'annual';
}
