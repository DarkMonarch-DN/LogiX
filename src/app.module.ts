import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { OrderModule } from './order/order.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
        VehicleModule,
        OrderModule,
    ],
})
export class AppModule {}
