import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

    @Get('verify-email')
    verifyEmail(@Query('id')id: string,@Query('token') code: string) {
        return this.authService.verifyEmail(id, code);
    }

    @Get('send-verify-email')
    sendEmailVerify(@Query('email') email: string) {
        return this.authService.sendEmailVerify(email);
    }

    @Get('send-reset-password')
    sendResetPassword(@Query('email') email: string) {
        return this.authService.sendResetPassword(email);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: {email: string, code: string, password: string}) {
        return this.authService.resetPassword(dto.email, dto.code, dto.password);
    }

    @Post('refresh-tokens')
    refreshTokens(@Body() dto: {userId: string, refreshToken: string}) {
        return this.authService.refreshTokens(dto.userId, dto.refreshToken);
    }

    @Post('log-out')
    logOut(@Body() dto: {userId: string}) {
        return this.authService.logOut(dto.userId);
    }
}
