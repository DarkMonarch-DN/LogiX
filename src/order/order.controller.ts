import { Body, Controller, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import type { User } from 'generated/prisma/browser';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseOrderDto } from './dto/response-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @Roles('client')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Создать новый заказ' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ResponseOrderDto })
    async createOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
        return this.orderService.createOrder(userId, dto);
    }

    @Get()
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Получить все заказы конкретного пользователя' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseOrderDto })
    async getAll(@CurrentUser() user: User) {
        return this.orderService.getAll(user);
    }

    @Patch('/:id/status')
    @Roles('driver', 'manager', 'admin')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Изменить статус заказа' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseOrderDto })
    async updateStatus(@CurrentUser() user: User, @Param('id') orderId: string, @Body() dto: UpdateOrderDto) {
        return this.orderService.updateStatus(user, orderId, dto);
    }
}
