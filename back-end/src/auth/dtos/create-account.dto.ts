import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { Match } from "src/helpers/customValidator/Match.decorator";

export class CreateAccountDto {

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

    @ApiProperty({ example: '12_Password' })
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;

    @ApiProperty({ example: 'Test User' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    phone: string;
}