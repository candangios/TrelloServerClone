const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'


let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_KEY


const sendEmail = async (recipientEmail, subject, htmlContent) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = { "name": "Admin CanDang", "email": "candd1707@gmail.com" }
  sendSmtpEmail.to = [
    { "email": recipientEmail }
  ];
  return await apiInstance.sendTransacEmail(sendSmtpEmail)
}
export const BrevoProvider = { sendEmail }