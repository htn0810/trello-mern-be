const SibApiV3Sdk = require("@getbrevo/brevo");
const { env } = require("~/config/environment");

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (subject, content, recipientEmail) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = content;
  sendSmtpEmail.sender = {
    name: env.ADMIN_EMAIL_NAME,
    email: env.ADMIN_EMAIL_ADDRESS,
  };
  sendSmtpEmail.to = [{ email: recipientEmail }];

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
