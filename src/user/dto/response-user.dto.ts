import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ResponseProfileDto {
    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    id!: string;
    @ApiProperty({ default: 'John' })
    firstName!: string;
    @ApiProperty({ default: 'Doe' })
    lastName!: string;
    @ApiProperty({ default: '+7 918 141 95-65' })
    phoneNumber!: string;

    @Exclude()
    userId!: string;
}

export class ResponseUserDto {
    @ApiProperty({ default: 'cmqto6mc00000bsb63kbxgjtr' })
    id!: string;
    @ApiProperty({ default: 'user@example.com' })
    email!: string;
    @ApiProperty({ default: 'user' })
    role!: string;
    @ApiProperty({ default: null })
    avatarUrl?: string;

    @Exclude()
    passwordHash!: string;

    @Exclude()
    refreshTokenHash?: string;

    @ValidateNested()
    @Type(() => ResponseProfileDto)
    @ApiProperty()
    profile!: ResponseProfileDto;

    @ApiProperty({ default: new Date().toISOString() })
    createdAt!: Date;
    @ApiProperty({ default: new Date().toISOString() })
    updatedAt!: Date;
}
