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

module.export = transporter