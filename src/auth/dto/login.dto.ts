import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @ApiProperty({
        default: 'user@example.com',
        description: 'Email к которому привязан аккаунт',
    })
    email!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(1000)
    @ApiProperty({
        default: '123456',
        description: 'Пароль от аккаунта',
    })
    password!: string;
}
