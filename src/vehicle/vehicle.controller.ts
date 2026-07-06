import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ParamsVehicleDto } from './dto/params-vehicle.dto';
import { ResponseVehicleDto } from './dto/response-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    @Post()
    @Roles('manager', 'admin')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Добавить новый транспорт' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ResponseVehicleDto })
    async addVehicle(@Body() dto: CreateVehicleDto) {
        return this.vehicleService.create(dto);
    }

    @Get()
    @Roles('manager', 'admin', 'driver')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Получить список транспорта с фильтрами' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseVehicleDto })
    async getAll(@Query() paramsFilter: ParamsVehicleDto) {
        return this.vehicleService.getAll(paramsFilter);
    }

    @Patch('/:id/status')
    @Roles('manager')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Поменять статус у конкретного транспорта' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseVehicleDto })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
        return this.vehicleService.updateStatus(id, dto);
    }
}
