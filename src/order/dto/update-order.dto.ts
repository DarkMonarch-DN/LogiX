import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'generated/prisma/enums';

export class UpdateOrderDto {
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    @ApiProperty({
        default: 'created',
        description: 'Статус заказа',
    })
    status!: OrderStatus;
}
