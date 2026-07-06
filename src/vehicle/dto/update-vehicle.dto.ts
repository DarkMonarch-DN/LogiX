import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty } from 'class-validator';
import { VehicleStatus } from 'generated/prisma/enums';

export class UpdateVehicleDto {
    @IsNotEmpty()
    @IsEnum(VehicleStatus)
    @ApiProperty({
        default: 'repair',
        description: 'Измененный статут транспорта',
    })
    status!: VehicleStatus;
}
