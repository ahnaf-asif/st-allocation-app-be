import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserCredentials(userEmail: string, password: string) {
		await this.mailerService.sendMail({
			to: userEmail,
			subject: 'Welcome to sysonex, Confirm your Email',
			text: `you can use this email with password:  '${password}' to login to sysonex`
		});
	}
	async forgotPassword(receiverMail: string, content: string) {
		await this.mailerService.sendMail({
			to: receiverMail,
			subject: 'password reset for sysrisk account',
			text: content
		});
	}
}
