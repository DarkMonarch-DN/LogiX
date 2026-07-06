import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ParamsVehicleDto } from './dto/params-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateVehicleDto) {
        return this.prisma.vehicle.create({
            data: dto,
        });
    }

    async getAll(params: ParamsVehicleDto) {
        return this.prisma.vehicle.findMany({
            where: {
                type: params.type,
                status: params.status,
                plateNumber: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });
    }

    async updateStatus(id: string, dto: UpdateVehicleDto) {
        return this.prisma.vehicle.update({
            where: { id },
            data: dto,
        });
    }
}
