import { ApiProperty } from '@nestjs/swagger';

import { OrderStatus } from 'generated/prisma/enums';

export class ResponseOrderDto {
    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    id!: string;

    @ApiProperty({ default: 'created' })
    status!: OrderStatus;

    @ApiProperty({ default: 83000 })
    price!: number;

    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    clientId!: string;

    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    driverId!: string;

    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    vehicleId!: string;

    @ApiProperty({ default: new Date().toISOString() })
    createdAt!: Date;
    @ApiProperty({ default: new Date().toISOString() })
    updatedAt!: Date;
}
