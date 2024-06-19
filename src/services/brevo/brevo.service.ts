import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

export interface EmailUser {
  name: string;
  email: string;
}
@Injectable()
export class BrevoService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async sendCreationMail(
    sender: EmailUser,
    to: EmailUser[],
    subject: string,
    showEmail: string,
    showPassword: string,
    body: string
  ) {
    const apiUrl = this.config.get('BREVO_API_URL');
    const apiKey = this.config.get('BREVO_API_KEY');

    const headers = {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    };

    const htmlContent = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Our Service</title>
          </head>
          <body>
              <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellspacing="0" cellpadding="0">
                              <tr>
                                  <td style="background-color: #8000b3; padding: 10px; text-align: center; color: #fff;">
                                      <h1>Welcome to BRACU ST Panel!</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 20px;">
                                      <p>${body} (${this.config.get('DEPARTMENT')})</p>
                                      <p>Here are your login credentials:</p>
                                      <ul>
                                          <li><strong>Link:</strong>${
                                            this.config.get('FE_URL') + '/login'
                                          }</li>
                                          <li><strong>Email:</strong> ${showEmail}</li>
                                          <li><strong>Password:</strong> ${showPassword}</li>
                                      </ul>
                                      <p>Please keep your login information secure. If you have any questions or need assistance, feel free to contact the mail <strong>ahnafshahriar92@gmail.com</strong></p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="background-color: #f5f5f5; padding: 10px;">
                                      <p>This is an automated email. Please do not reply to this message.</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>`;

    try {
      const response = await axios.post(apiUrl, { sender, to, subject, htmlContent }, { headers });

      const user = await this.prisma.user.update({
        where: {
          email: to[0].email
        },
        data: {
          verificationEmailSent: true
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendPasswordResetLink(sender: EmailUser, to: EmailUser[], subject: string, token: string) {
    const apiUrl = this.config.get('BREVO_API_URL');
    const apiKey = this.config.get('BREVO_API_KEY');

    const headers = {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    };

    const htmlContent = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Our Service</title>
          </head>
          <body>
              <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellspacing="0" cellpadding="0">
                              <tr>
                                  <td style="background-color: #8000b3; padding: 10px; text-align: center; color: #fff;">
                                      <h1>BRACU ST Panel Password Reset</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 20px;">                                   
                                      <p>Here is the password link:</p>
                                      <ul>
                                          <li>${
                                            this.config.get('FE_URL') + '/password-reset/' + token
                                          }</li>
                                      </ul>
                                      <p>If you did not ask for a password reset request, you can ignore this email. Otherwise you can use the above link to reset your password. If you have any questions or need assistance, feel free to contact the mail <strong>ahnafshahriar92@gmail.com</strong></p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="background-color: #f5f5f5; padding: 10px;">
                                      <p>This is an automated email. Please do not reply to this message.</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>`;

    try {
      const response = await axios.post(apiUrl, { sender, to, subject, htmlContent }, { headers });

      const user = await this.prisma.user.update({
        where: {
          email: to[0].email
        },
        data: {
          verificationEmailSent: true
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
