import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from 'generated/prisma/browser';
import { LoginDto } from './dtos/login.dto';
import { CreateAccountDto } from './dtos/create-account.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
         private readonly jwtService: JwtService) {}
    

    private async CreateTokens(user: Prisma.UserCreateInput) {
        
        const payload = { sub: user.id, email: user.email };

        const accessToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        });

        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            refresh_token: refreshToken,
          },
        })

        return {
          accessToken,
          refreshToken,
        };
    }
    async logIn(dto:LoginDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                normalized_email: dto.email.trim().toUpperCase()
            }
        })

        if(!user) {
            throw new NotFoundException('Email not found');
        }

        const isValidPassword = await argon2.verify(user.password_hash, dto.password);

        if(!isValidPassword) {
            throw new UnauthorizedException('Invalid password');
        }
        
        return await this.CreateTokens(user);
    }

    async createAccount(dto: CreateAccountDto) {

        const userExists = await this.prisma.user.findUnique({
            where: {
                normalized_email: dto.email.trim().toUpperCase()
            }
        });

        if(userExists) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await argon2.hash(dto.password);

        const user: Prisma.UserCreateInput = {
            email: dto.email,
            normalized_username: dto.username.trim().toUpperCase(),
            username: dto.username,
            phone: dto.phone,
            password_hash: hashedPassword,
            normalized_email: dto.email.trim().toUpperCase(),
            role: 'User'
        }

        const createdUser = await this.prisma.user.create({
            data: user
        });

        return await this.CreateTokens(createdUser);
    }
}
