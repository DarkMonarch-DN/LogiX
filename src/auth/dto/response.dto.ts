import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsJWT, IsString, ValidateNested } from 'class-validator';

import { ResponseUserDto } from 'src/user/dto/response-user.dto';

export class ResponseAuthDto {
    @ValidateNested()
    @Type(() => ResponseUserDto)
    @ApiProperty()
    user!: ResponseUserDto;

    @IsJWT()
    @IsString()
    @ApiProperty({
        default:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXF0bzZtYzAwMDAwYnNiNjNrYnhnanRyIiwiaWF0IjoxNzgyNDAzOTcyLCJleHAiOjE3ODI0MDQ4NzJ9.GaPghWL61yA6ajM5SvirwpbOnAt482RLZSlMam8Pi7E',
        description: 'Токен для доступа к аккаунту',
    })
    accessToken!: string;
}
