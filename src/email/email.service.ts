
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendTeacherCredentials(email: string, password: string) {
    console.log(process.env.SENDER_EMAIL);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your New Account Credentials',
      text: `Welcome to Skywards! Your account has been created.\n\nUsername: ${email}\nPassword: ${password}\n\nPlease change your password after your first login.`,
      html: `
        <div class="max-w-2xl mx-auto p-8">
        <div class="bg-white rounded-lg shadow-md p-8">
            <h1 class="text-3xl font-bold text-blue-600 mb-6">Welcome to Skywards!</h1>
            <p class="text-gray-700 mb-4">Your account has been successfully created. Here are your login credentials:</p>
            <div class="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
                <p class="mb-2"><span class="font-semibold">Username:</span> ${email}</p>
                <p><span class="font-semibold">Password:</span> ${password}</p>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                <strong>Important:</strong> For security reasons, please do not share your credintials.
            </div>
        </div>
    </div>
      `,
    });
  }
}