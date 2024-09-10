import nodemailer from 'nodemailer';

/* // Configure Mailgun 
const DOMAIN = process.env.MAILGUN_DOMAIN; 
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const sendEmail = (receiver_email) => {
    const data = {
        from: 'bargogh@gmail.com',
        to: receiver_email,
        subject: 'Receipt Confirmation',
        text: 'Thank you for your message. We have received your email and will respond shortly.',
        html: `
    <p>Thank you for your message.</p>
    <p>We have received your email and will respond shortly.</p>
    `,
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', body);
        }
    });
}; */

// Configure Nodemailer with your email service and credentials
const transporter = nodemailer.createTransport({
    port: 465,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your password or app-specific password
    },
});

// Function to create email data
const mailData = (receiver_email, subject, text, html) => ({
    from: 'bargogh@gmail.com',  // Sender's email address
    to: receiver_email,   // Recipient's email address
    subject: subject,     // Email subject
    text: text,           // Plain text version of the email
    html: html            // HTML content of the email
});

// Function to send the email
const sendEmail = (receiver_email, subject, text, html) => {
    const mailOptions = mailData(receiver_email, subject, text, html);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
};

export { sendEmail };
