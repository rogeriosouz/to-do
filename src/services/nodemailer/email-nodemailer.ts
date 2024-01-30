import { configTest } from '../../config/nodemailer'
import { EmailService } from '../email'

export class EmailNodemailerService implements EmailService {
  async sendEmail(email: string, body: string) {
    await configTest.sendMail({
      from: 'rogeriotest@gmail.com',
      to: email,
      subject: 'Hello ✔',
      text: 'Hello world?',
      html: body,
    })
  }
}
