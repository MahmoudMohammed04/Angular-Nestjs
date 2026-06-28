import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class LoginDto {

    @ApiProperty({ example: 'test@email.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @ApiProperty({ example: '12_Password' })
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;
}