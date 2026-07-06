import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    HttpStatus,
    MaxFileSizeValidator,
    ParseFilePipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';
import type { User } from 'generated/prisma/browser';
import type { Multer } from 'multer';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Получить пользователя' })
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
    })
    getMe(@CurrentUser() user: User) {
        return plainToInstance(ResponseUserDto, user);
    }

    @Patch('/edit')
    @ApiBearerAuth('token')
    @ApiOperation({ summary: 'Редактировать данные' })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseUserDto })
    async editProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
        const user = await this.userService.update(dto, userId);
        return plainToInstance(ResponseUserDto, user);
    }

    @Post('/avatar/upload')
    @ApiBearerAuth('token')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Загрузить аватар' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseUserDto })
    async uploadAvatar(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
                    new FileTypeValidator({ fileType: /(image\/jpeg|image\/png|image\/webp|image\/jpg|image\/gif)/ }),
                ],
            }),
        )
        file: Express.Multer.File,
        @CurrentUser() user: User,
    ) {
        const updatedUser = await this.userService.uploadAvatar(file, user);
        return plainToInstance(ResponseUserDto, updatedUser);
    }
}
