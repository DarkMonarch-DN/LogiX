import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import type { User } from 'generated/prisma/browser';
import { OrderStatus, UserRoles, VehicleStatus } from 'generated/prisma/enums';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(userId: string, dto: CreateOrderDto) {
        return this.prisma.$transaction(async (tx) => {
            const vehicle = await tx.vehicle.findFirst({
                where: { type: dto.vehicleType, status: VehicleStatus.available },
            });
            if (!vehicle) throw new BadRequestException('All the equipment is currently in use.');

            const driver = await tx.user.findFirst({
                where: {
                    role: UserRoles.driver,
                    driverOrders: {
                        none: {
                            status: OrderStatus.in_progress,
                        },
                    },
                },
            });

            if (!driver) throw new BadRequestException('There are no available drivers at the moment.');

            await tx.vehicle.update({
                where: { id: vehicle.id },
                data: { status: VehicleStatus.in_use },
            });
            return tx.order.create({
                data: {
                    price: dto.price,
                    clientId: userId,
                    vehicleId: vehicle.id,
                    driverId: driver.id,
                    status: OrderStatus.created,
                },
            });
        });
    }

    async getAll(user: User) {
        switch (user.role) {
            case UserRoles.client:
                return this.prisma.order.findMany({
                    where: { clientId: user.id },
                });
            case UserRoles.driver:
                return this.prisma.order.findMany({
                    where: { driverId: user.id },
                });
            default: // admin or manager
                return this.prisma.order.findMany({ include: { driver: true, client: true } });
        }
    }

    async updateStatus(user: User, orderId: string, dto: UpdateOrderDto) {
        const order = await this.prisma.order.findUniqueOrThrow({
            where: { id: orderId },
            include: { vehicle: true },
        });

        if (user.role === UserRoles.driver && order.driverId !== user.id) {
            throw new ForbiddenException('You are not assigned to this order');
        }

        return this.prisma.$transaction(async (tx) => {
            if (dto.status === OrderStatus.cancelled) {
                if (user.role !== UserRoles.manager && user.role !== UserRoles.admin) {
                    throw new BadRequestException('Only managers can cancel orders');
                }

                if (order.vehicleId) {
                    await tx.vehicle.update({
                        where: { id: order.vehicleId },
                        data: { status: VehicleStatus.available },
                    });
                }
            }

            if (dto.status === OrderStatus.completed) {
                if (order.vehicleId) {
                    await tx.vehicle.update({
                        where: { id: order.vehicleId },
                        data: { status: VehicleStatus.available },
                    });
                }
            }
            return tx.order.update({
                where: { id: orderId },
                data: { status: dto.status },
            });
        });
    }
}
