import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    
    constructor() {}

    @UseGuards(AuthGuard('jwt'))
    @Post('register')
    @ApiBody({ type: CreateAccountDto })
    createAccount(@Req() req,@Body() dto: CreateAccountDto) {
        // return this.authService.createAccount(dto);
    }

}
