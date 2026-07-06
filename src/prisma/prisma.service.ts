import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        const pool = new Pool({
            connectionString: configService.get<string>('DATABASE_URL'),
            max: 10,
            idleTimeoutMillis: 10000,
        });

        // 2. Передаем пул в адаптер Prisma v7
        const adapter = new PrismaPg(pool);

        super({ adapter });
    }
}
