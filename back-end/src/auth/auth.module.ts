import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { argon2 } from 'crypto';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret',
            signOptions: { expiresIn: '1h' },
        }),
        
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
