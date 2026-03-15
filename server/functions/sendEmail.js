import { createTransport } from 'nodemailer';
import handlebars from 'handlebars';
const { compile } = handlebars;
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Read the email template from a file

const emailTemplatePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..', 'templates', 'emailtemplate.html'
);
const source = readFileSync(emailTemplatePath, 'utf8');

// Compile the template using Handlebars
const template = compile(source);

// Create a nodemailer transporter
const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: '************@gmail.com', // Replace with your email address
    pass: '***********' // Replace with your email password or app password
  },
  tls: {
    ciphers: 'TLSv1.2'
  }
});

// Function to send email with verification code
const sendVerificationEmail = (name, verificationCode, toEmail, fromEmail) => {
  // Generate the HTML content of the email
  const html = template({ name, verificationCode });

  // Send the email
  transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: 'Verification Code',
    html: html
  }, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export default sendVerificationEmail