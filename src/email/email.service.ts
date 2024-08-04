
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendTeacherCredentials(email: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Skywards Academy - Your New Teacher Account',
      text: `Dear Educator,
  
  Welcome to Skywards Academy! We're thrilled to have you join our teaching staff.
  
  Your account has been created with the following credentials:
  
  Username: ${email}
  Password: ${password}
  
  For security reasons, please change your password after your first login.
  
  We look forward to the positive impact you'll make on our students' lives.
  
  Best regards,
  The Skywards Academy Team`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #f0f4f8; border-radius: 10px; padding: 30px; border-top: 5px solid #3498db;">
            <h1 style="color: #3498db; font-size: 24px; margin-bottom: 20px;">Welcome to Skywards Academy!</h1>
            <p style="color: #333; line-height: 1.6;">Dear Educator,</p>
            <p style="color: #333; line-height: 1.6;">We are thrilled to welcome you to our teaching staff at Skywards Academy. Your expertise and passion for education will be invaluable to our students.</p>
            <div style="background-color: #ffffff; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>Your account credentials:</strong></p>
              <p style="margin: 10px 0 0; color: #333;"><strong>Username:</strong> ${email}</p>
              <p style="margin: 5px 0 0; color: #333;"><strong>Password:</strong> ${password}</p>
            </div>
            <p style="color: #333; line-height: 1.6;">For security reasons, please change your password after your first login.</p>
            <div style="background-color: #fef9e7; border: 1px solid #f39c12; border-radius: 5px; padding: 10px; margin-top: 20px;">
              <p style="color: #9a7d0a; margin: 0;"><strong>Important:</strong> Keep your credentials confidential. Never share your password with anyone.</p>
            </div>
            <p style="color: #333; line-height: 1.6; margin-top: 20px;">We're excited about the positive impact you'll make on our students' lives. If you have any questions, please don't hesitate to reach out to our IT support team.</p>
            <p style="color: #333; line-height: 1.6;">Best regards,<br>The Skywards Academy Team</p>
          </div>
        </div>
      `,
    });
  }

  async sendStudentCredentials(email: string, password: string) {
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Skywards Academy - Your New Student Account',
      text: `Dear Student,
  
  Welcome to Skywards Academy! We're excited to have you join our learning community.
  
  Your account has been created with the following credentials:
  
  Username: ${email}
  Password: ${password}
  
  For security reasons, please change your password after your first login.
  
  We look forward to supporting you on your educational journey.
  
  Best wishes,
  The Skywards Academy Team`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #f0f4f8; border-radius: 10px; padding: 30px; border-top: 5px solid #4CAF50;">
            <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Welcome to Skywards Academy!</h1>
            <p style="color: #333; line-height: 1.6;">Dear Student,</p>
            <p style="color: #333; line-height: 1.6;">We are thrilled to welcome you to Skywards Academy. Your journey of learning and growth starts here!</p>
            <div style="background-color: #ffffff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>Your account credentials:</strong></p>
              <p style="margin: 10px 0 0; color: #333;"><strong>Username:</strong> ${email}</p>
              <p style="margin: 5px 0 0; color: #333;"><strong>Password:</strong> ${password}</p>
            </div>
            <p style="color: #333; line-height: 1.6;">For security reasons, please change your password after your first login.</p>
            <div style="background-color: #FFF3E0; border: 1px solid #FFB74D; border-radius: 5px; padding: 10px; margin-top: 20px;">
              <p style="color: #E65100; margin: 0;"><strong>Important:</strong> Keep your credentials safe. Never share your password with anyone.</p>
            </div>
            <p style="color: #333; line-height: 1.6; margin-top: 20px;">We're excited to support you on your educational journey. If you have any questions, don't hesitate to ask your teachers or contact our student support team.</p>
            <p style="color: #333; line-height: 1.6;">Best wishes,<br>The Skywards Academy Team</p>
          </div>
        </div>
      `,
    });
  }
}