import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @ApiProperty({
        default: 'John',
        description: 'Имя пользователя',
    })
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @ApiProperty({
        default: 'Doe',
        description: 'Фамилия пользователя',
    })
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    @ApiProperty({
        default: '+7 918 141 95-65',
        description: 'Номер телефона к которому будет привязана запись',
    })
    phoneNumber?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({
        default: 'user@example.com',
        description: 'Email к которому привязан аккаунт',
    })
    email?: string;
}
