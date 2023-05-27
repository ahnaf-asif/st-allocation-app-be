import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get('MAIL_HOST'),
					secure: true,
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASS')
					}
				},
				defaults: {
					from: `"No Reply" <${config.get('MAIL_FROM')}>`
				}
			}),
			inject: [ConfigService]
		})
	],
	exports: [MailService],
	providers: [MailService]
})
export class MailModule {}
