import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseAuthDto } from './dto/response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('/login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseAuthDto })
    async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
        const { user, accessToken, refreshToken } = await this.authService.login(dto);
        this.setRefreshTokenCookie(res, refreshToken);
        return plainToInstance(ResponseAuthDto, { user, accessToken });
    }

    @Post('/refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Запросить новый access токен' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseAuthDto })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = this.extractRefreshTokenFromCookie(req);
        const { user, accessToken, refreshToken } = await this.authService.refresh(token);
        this.setRefreshTokenCookie(res, refreshToken);
        return plainToInstance(ResponseAuthDto, { user, accessToken });
    }

    @Post('/logout')
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Выйти из записи' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async logout(@Res({ passthrough: true }) res: Response, @CurrentUser('id') userId: string) {
        await this.authService.logout(userId);
        res.clearCookie('refreshToken');
    }

    private setRefreshTokenCookie(res: Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    private extractRefreshTokenFromCookie(req: Request) {
        const token = req.cookies?.refreshToken;
        if (!token) throw new UnauthorizedException('Refresh token not found');

        return token;
    }
}
