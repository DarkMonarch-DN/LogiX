import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiReference } from '@scalar/nestjs-api-reference';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const port = config.get<number>('APPLICATION_PORT') ?? 3000;
    const host = config.get<string>('ALLOWED_HOST') ?? 'localhost';
    app.setGlobalPrefix('api');
    const openApiConfig = new DocumentBuilder()
        .setTitle('LogiX API')
        .setDescription('Сильный менеджер для управления грузоперевозками и техникой.')
        .setVersion('1.0.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Введите ваш jwt токен',
            in: 'header',
        })
        .build();

    const document = SwaggerModule.createDocument(app, openApiConfig);

    app.use(
        '/openapi',
        apiReference({
            spec: {
                content: document,
            },
            theme: 'elysiajs',
            authentication: {
                preferredSecurityScheme: 'token',
            },
        }),
    );
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    app.enableCors({
        origin: config.get<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposedHeaders: ['set-cookie'],
    });
    app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
    app.use(cookieParser(config.get<string>('COOKIES_SECRET')));
    app.useGlobalFilters(new PrismaExceptionFilter());

    await app.listen(port, host, () => {
        console.log(`Server started on port: ${port}`);
        console.log(`http://localhost:${port}/openapi`);
    });
}
bootstrap();
