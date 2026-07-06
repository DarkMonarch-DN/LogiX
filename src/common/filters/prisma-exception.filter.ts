import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Prisma } from 'generated/prisma/client';

export const PRISMA_ERRORS = {
    UNIQUE: 'P2002',
    NOT_FOUND: 'P2025',
    FOREIGN_KEY: 'P2003',
} as const;

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = 500;
        let message = 'Internal server error';

        switch (exception.code) {
            case PRISMA_ERRORS.UNIQUE: // Уникальное ограничение
                status = 409;
                message = `Duplicate value for field: ${exception.meta?.target}`;
                break;
            case PRISMA_ERRORS.NOT_FOUND: // Запись не найдена (для delete/update)
                status = 404;
                message = 'Record not found';
                break;
            case PRISMA_ERRORS.FOREIGN_KEY: // Нарушение внешнего ключа
                status = 400;
                message = 'Related record does not exist';
                break;
            // Добавь остальные коды по мере необходимости
            default:
                status = 500;
                message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
