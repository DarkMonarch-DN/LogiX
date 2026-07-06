import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VehicleType } from 'generated/prisma/enums';

export class CreateVehicleDto {
    @IsNotEmpty()
    @IsEnum(VehicleType)
    @ApiProperty({
        default: 'excavator',
        description: 'Тип транспорта',
    })
    type!: VehicleType;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        default: '4318-age-34',
        description: 'Уникальный номер транспорта',
    })
    plateNumber!: string;
}
