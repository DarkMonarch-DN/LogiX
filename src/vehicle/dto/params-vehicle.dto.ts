import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VehicleStatus, VehicleType } from 'generated/prisma/enums';

export class ParamsVehicleDto {
    @IsOptional()
    @IsEnum(VehicleType)
    @ApiProperty({
        default: 'truck',
        description: 'Фильтровать по типу транспорта',
    })
    type?: VehicleType;

    @IsOptional()
    @IsEnum(VehicleStatus)
    @ApiProperty({
        default: 'repair',
        description: 'Фильтровать по статусу транспорта',
    })
    status?: VehicleStatus;

    @IsOptional()
    @IsString()
    @ApiProperty({
        default: '2341-sd-24',
        description: 'Поиск по уникальному номеру транспорта.',
    })
    search?: string;
}
