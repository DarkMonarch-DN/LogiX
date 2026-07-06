import { ApiProperty } from '@nestjs/swagger';

import { VehicleStatus, VehicleType } from 'generated/prisma/enums';

export class ResponseVehicleDto {
    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    id!: string;

    @ApiProperty({ default: 'excavator' })
    type!: VehicleType;

    @ApiProperty({ default: '3451ae-12' })
    plateNumber!: string;

    @ApiProperty({ default: 'available' })
    status!: VehicleStatus;

    @ApiProperty({ default: new Date().toISOString() })
    createdAt!: Date;
    @ApiProperty({ default: new Date().toISOString() })
    updatedAt!: Date;
}
