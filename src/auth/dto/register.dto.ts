import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from 'generated/prisma/enums';

const allowedRoles = [UserRoles.client, UserRoles.driver] as const;
export type AllowedRoles = (typeof allowedRoles)[number];

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @ApiProperty({
        default: 'John',
        description: 'Имя пользователя',
    })
    firstName!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @ApiProperty({
        default: 'Doe',
        description: 'Фамилия пользователя',
    })
    lastName!: string;

    @IsString()
    @IsPhoneNumber()
    @ApiProperty({
        default: '+7 918 141 95-65',
        description: 'Номер телефона к которому будет привязана запись',
    })
    phoneNumber!: string;

    @IsString()
    @IsString()
    @IsEnum(allowedRoles, {
        message: `role must be one of the following values: ${allowedRoles.join(', ')}`,
    })
    @ApiProperty({
        type: String,
        enum: allowedRoles,
        default: UserRoles.client,
        description: 'Роль пользователя',
    })
    role!: AllowedRoles;

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
