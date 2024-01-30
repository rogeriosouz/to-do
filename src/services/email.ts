export interface EmailService {
  sendEmail(email: string, body: string): Promise<void>
}
