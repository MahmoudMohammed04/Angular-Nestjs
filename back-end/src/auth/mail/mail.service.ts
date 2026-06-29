import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    async sendEmailVerify(email: string, link: string) {

            await this.mailerService.sendMail({
              to: email,
              subject: 'Verify Email',
              template: 'email',
              context: {
                title: 'Verify your email',
                showLink: true,
                showCode: false,
                link: link, 
              },
            });
        
    }

    async sendResetPassword(email: string,code:string) {

        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset Password',
          template: 'email',
          context: {
            showLink: false,
            showCode: true,
            code: code,
          },
        });
    }

}
