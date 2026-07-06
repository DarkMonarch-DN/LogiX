import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { hash, verify } from 'argon2';
import { User } from 'generated/prisma/browser';

import { UserService } from 'src/user/user.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto) {
        const user = await this.userService.create(
            dto.email,
            dto.role,
            await hash(dto.password),
            dto.firstName,
            dto.lastName,
            dto.phoneNumber,
        );
        return {
            success: true,
            message: 'Register Successful',
        };
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);
        return {
            user,
            ...(await this.generateTokens(user)),
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('REFRESH_SECRET'),
            });
            const user = await this.userService.findById(payload.sub);
            return {
                user,
                ...(await this.generateTokens(user)),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string) {
        await this.userService.updateRefreshToken(userId, null);
    }

    private async generateTokens(user: User) {
        const payload = { sub: user.id };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('REFRESH_SECRET'),
                expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
            }),
        ]);

        await this.userService.updateRefreshToken(user.id, await hash(refreshToken));

        return { accessToken, refreshToken };
    }

    private async validateUser(email: string, password: string): Promise<User> {
        const unauthorizedException = new UnauthorizedException('Invalid credentials');
        const user = await this.userService.findByEmail(email);
        if (!user) throw unauthorizedException;

        const isValidPassword = await verify(user.passwordHash, password);
        if (!isValidPassword) throw unauthorizedException;

        return user;
    }
}
