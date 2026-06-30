import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule
    ],
    controllers: [AuthController],
    providers: [JwtStrategy],
})
export class AuthModule {}
