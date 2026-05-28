import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription.dto';

// We don't really want users updating subscriptions freely,
// but admin might update orderStatus/paymentStatus
export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}