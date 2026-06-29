import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dtos/login.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { MailService } from './mail/mail.service';
import { randomBytes, randomInt } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) {}
    

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

        const emailToken = randomBytes(32).toString('hex');

        const user: Prisma.UserCreateInput = {
            email: dto.email,
            normalized_username: dto.username.trim().toUpperCase(),
            email_confirm_code:emailToken,
            email_code_expired: new Date(Date.now() + 60*60*1000),
            username: dto.username,
            phone: dto.phone,
            password_hash: hashedPassword,
            normalized_email: dto.email.trim().toUpperCase(),
            is_email_confirmed: false,
            role: 'User'
        }
 
        const createdUser = await this.prisma.user.create({
            data: user
        });

        const domain = process.env.APP_URL;
        await this.mailService.sendEmailVerify(dto.email, `${domain}/api/auth/verify-email?id=${createdUser.id}&code=${emailToken}`); 
        return await this.CreateTokens(createdUser);
    }

    async sendEmailVerify(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                normalized_email: email.trim().toUpperCase()
            }
        });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const emailToken = randomBytes(32).toString('hex');

        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                email_confirm_code:emailToken,
                email_code_expired: new Date(Date.now() + 60*60*1000),
            }
        });

        const domain = process.env.APP_URL;
        await this.mailService.sendEmailVerify(email, `${domain}/api/auth/verify-email?id=${user.id}&code=${emailToken}`);
    }
    async verifyEmail(id: string, code: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        if(user.email_code_expired !== null && user.email_code_expired < new Date()) {
            throw new BadRequestException('Code expired');
        }

        if(user.email_confirm_code !== code) {
            throw new BadRequestException('Invalid code');
        }



        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                email_confirm_code: null,
                email_code_expired: null,
                is_email_confirmed: true
            }
        });

        return true
    }

    async sendResetPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                normalized_email: email.trim().toUpperCase()
            }
        });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const resetPasswordCode = randomInt(100000,1000000).toString();
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                rest_password_code: resetPasswordCode
            }
        });

        await this.mailService.sendResetPassword(email,resetPasswordCode); 
    }

    async resetPassword(email: string, code: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                normalized_email: email.trim().toUpperCase()
            }
        });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        if(user.password_code_expired !== null && user.password_code_expired < new Date()) {
            throw new BadRequestException('Code expired');
        }
        if(user.rest_password_code !== code) {
            throw new BadRequestException('Invalid code');
        }

        const hashedPassword = await argon2.hash(password);
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                rest_password_code: null,
                password_hash: hashedPassword
            }
        });
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    
        if(!user || !user.refresh_token) {
            throw new ForbiddenException('Access Denied')
        }
    
        const refreshTokenMatches = user.refresh_token === refreshToken;
    
        if(!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied')
        }
    
        return await this.CreateTokens(user);
    }

    async logOut(userId: string) {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refresh_token: null
            }
        });
    }
}
