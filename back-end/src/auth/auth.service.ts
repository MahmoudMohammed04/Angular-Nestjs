import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';

import { CreateAccountDto } from './dtos/create-account.dto';
import { MailService } from './mail/mail.service';
import { randomBytes, randomInt } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    
  
    async createAccount(dto: Prisma.UserCreateInput) {
       
    }


}
