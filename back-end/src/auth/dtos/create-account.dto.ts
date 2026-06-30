import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { Match } from "src/helpers/customValidator/Match.decorator";

export class CreateAccountDto {

    
    @ApiProperty({ example: 'Test User' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    phone: string;
}