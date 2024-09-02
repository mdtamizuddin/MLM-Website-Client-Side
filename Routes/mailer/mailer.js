const nodemailer = require('nodemailer');
// Email settings
const EMAIL_HOST = 'smtp-relay.brevo.com';
const EMAIL_PORT = 587;
const EMAIL_ADDRESS = '74c6a8001@smtp-brevo.com';
const EMAIL_PASSWORD = 'L41P7pDOEBvk9dzj';

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // use TLS
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },
});
const sendResetCode = async (email, code) => {
    try {
        const mail = await transporter.sendMail({
            from: '74c6a8001@smtp-brevo.com',
            to: email,
            subject: "Reset Password",
            html: `
                <h1>Reset Password</h1>
                <p>Click the link below: <a href="https://cnppromo.vercel.app/forgot-password?code=${code}">
                Click here
                </a></p>
                `
        });
        return mail
    } catch (error) {
        throw new Error(error)
    }
}

const mailerService = {
    sendResetCode
}

module.exports = mailerService