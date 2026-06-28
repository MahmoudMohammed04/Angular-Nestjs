import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dtos/create-account.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiBody({ type: LoginDto })
    logIn(@Body() dto:LoginDto) {
        return this.authService.logIn(dto);
    }

    @Post('register')
    @ApiBody({ type: CreateAccountDto })
    createAccount(@Body() dto: CreateAccountDto) {
        return this.authService.createAccount(dto);
    }
}
