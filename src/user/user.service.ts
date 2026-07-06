import { Injectable } from '@nestjs/common';

import { unlink } from 'fs/promises';
import { User, UserRoles } from 'generated/prisma/browser';
import { join } from 'path';
import sharp from 'sharp';

import { AllowedRoles } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    create(
        email: string,
        role: AllowedRoles,
        passwordHash: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
    ) {
        return this.prisma.user.create({
            data: {
                role,
                email,
                passwordHash,
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phoneNumber,
                    },
                },
            },
            include: { profile: true },
        });
    }

    findById(id: string): Promise<User> {
        return this.prisma.user.findUniqueOrThrow({
            where: { id },
            include: {
                profile: true,
            },
        });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
            },
        });
    }

    update(dto: UpdateUserDto, userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                email: dto.email,
                profile: {
                    update: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        phoneNumber: dto.phoneNumber,
                    },
                },
            },
            include: { profile: true },
        });
    }

    updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash },
        });
    }

    updateAvatar(userId: string, avatarUrl: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        });
    }

    async uploadAvatar(file: Express.Multer.File, user: User) {
        const oldAvatarPath = user?.avatarUrl;

        const filename = `${Date.now()}-${user.id}.webp`;
        const relativePath = `/uploads/${filename}`;
        const outputPath = join(process.cwd(), relativePath);

        try {
            await sharp(file.buffer)
                .resize({ width: 400, height: 400, fit: 'cover' })
                .toFormat('webp')
                .toFile(outputPath);

            if (oldAvatarPath) {
                const absoluteOldPath = join(process.cwd(), oldAvatarPath);
                await unlink(absoluteOldPath).catch((err) => {
                    console.warn(`Не удалось удалить старый файл: ${absoluteOldPath}`, err.message);
                });
            }

            const updatedUser = await this.updateAvatar(user.id, relativePath);
            return updatedUser;
        } catch (err) {
            console.log('Ошибка при обработке аватара: ', err);
            throw err;
        }
    }
}
