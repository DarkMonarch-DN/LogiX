import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { VehicleType } from 'generated/prisma/enums';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsEnum(VehicleType)
    @ApiProperty({
        default: 'truck',
        description: 'Транспорт что требуется для заказа',
    })
    vehicleType!: VehicleType;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        default: 6000,
        description: 'Цена которую желает клиент',
    })
    price!: number;
}
