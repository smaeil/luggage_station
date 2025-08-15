import nodmailer from 'nodemailer';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const transporter = nodmailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net'
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465, 'false' for other ports
    auth: {
        user: process.env.EMAIL_ADDRESS, // The actual email address to authenticate with
        pass: process.env.EMAIL_PASSWORD // The password or API key for the email account
  }
});


// loading the html template 
const emailTemplate = fs.readFileSync(path.join(__dirname, 'default.html'), 'utf-8');
const template = Handlebars.compile(emailTemplate);

const sendEmail = async (to, subject, templateData) => {
    try {

        const html2Send = template(templateData);
        
        const mailOptions = {
            from: `"Luggage Station App" <${process.env.EMAIL_NOREPLY}>`,
            to: to,
            subject: subject,
            html: html2Send,
            replyTo: process.env.EMAIL_NOREPLY
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(mailOptions);
        console.log({
            host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net'
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, // Use 'true' for port 465, 'false' for other ports
            auth: {
                user: process.env.EMAIL_ADDRESS, // The actual email address to authenticate with
                pass: process.env.EMAIL_PASSWORD // The password or API key for the email account
            }
        });

        return info;

    } catch (error) {
        throw error;

        console.log(mailOptions);
        console.log({
            host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net'
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, // Use 'true' for port 465, 'false' for other ports
            auth: {
                user: process.env.EMAIL_ADDRESS, // The actual email address to authenticate with
                pass: process.env.EMAIL_PASSWORD // The password or API key for the email account
            }
        });
    }
}

export default sendEmail;