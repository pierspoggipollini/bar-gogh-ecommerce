import nodemailer from 'nodemailer';

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

// Function to send the email (nodemailer v8 — promise-based API)
const sendEmail = async (receiver_email, subject, text, html) => {
    const mailOptions = mailData(receiver_email, subject, text, html);
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export { sendEmail };
