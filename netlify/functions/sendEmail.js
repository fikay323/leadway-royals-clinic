// netlify/functions/sendEmail.js

const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  try {
    const { doctorName, patientName, appointmentTime, email } = JSON.parse(event.body);

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Set up the email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Appointment Confirmation with ${doctorName}`,
      text: `Dear ${patientName},\n\nYour appointment with ${doctorName} is confirmed for ${appointmentTime}.\n\nThank you.`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', info }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
