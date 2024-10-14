const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { DateTime } = require('luxon');

admin.initializeApp();

// Setup for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fagbenrocoa@gmail.com',  // Replace with your email
    pass: 'Fikayomi',  // Replace with your password or app-specific password
  },
});

// Function to send an email when a new schedule is booked
exports.sendScheduleEmail = functions.firestore
  .document('schedules/{scheduleId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const timeSlots = newValue.timeSlots;

    // Check for a newly booked timeSlot
    timeSlots.forEach((slot) => {
      if (!slot.isAvailable && !slot.emailSent) {  // If the slot was booked and no email has been sent
        const doctorFullName = `Dr. ${newValue.doctorFirstName[0]}. ${newValue.doctorLastName}`;
        const patientFullName = `${slot.bookerName.firstName[0]}. ${slot.bookerName.lastName}`;
        const appointmentTime = DateTime.fromISO(slot.startTIme).toLocaleString(DateTime.DATETIME_FULL);

        // Email Content
        const mailOptions = {
          from: 'fagbenrocoa@gmail.com@gmail.com',
          to: slot.bookerPersonalInformation.email,  // Send to the patient
          subject: `Appointment Booked`,
          text: `Your appointment with ${doctorFullName} is confirmed for ${appointmentTime}.`,
        };

        // Send the email
        return transporter.sendMail(mailOptions)
          .then(() => {
            console.log('Email sent to patient:', mailOptions.to);
            // Mark the email as sent in Firestore
            change.after.ref.update({
              [`timeSlots.${timeSlots.indexOf(slot)}.emailSent`]: true,
            });
          })
          .catch((error) => {
            console.error('Error sending email:', error);
          });
      }
    });
    return null;
  });

// Function to send reminder emails at 7 AM on the day of the appointment
exports.sendDailyReminder = functions.pubsub.schedule('0 7 * * *').onRun(async (context) => {
  const currentDate = DateTime.now().setZone('UTC').startOf('day').toISO();

  // Query schedules that match the current date
  const schedulesSnapshot = await admin.firestore().collection('schedules').get();
  
  schedulesSnapshot.forEach((doc) => {
    const schedule = doc.data();
    const timeSlots = schedule.timeSlots;

    // Send reminders for today's appointments
    timeSlots.forEach((slot) => {
      if (slot.startTime.startsWith(currentDate) && !slot.reminderSent) {
        const doctorFullName = `Dr. ${schedule.doctorFirstName[0]}. ${schedule.doctorLastName}`;
        const patientFullName = `${slot.bookerName.firstName[0]}. ${slot.bookerName.lastName}`;
        const appointmentTime = DateTime.fromISO(slot.startTime).toLocaleString(DateTime.DATETIME_FULL);

        // Email Content
        const mailOptions = {
          from: 'fagbenrocoa@gmail.com',
          to: slot.bookerPersonalInformation.email,
          subject: `Appointment Reminder`,
          text: `Reminder: You have an appointment with ${doctorFullName} today at ${appointmentTime}.`,
        };

        // Send the email
        transporter.sendMail(mailOptions)
          .then(() => {
            console.log('Reminder email sent:', mailOptions.to);
            // Mark the reminder as sent in Firestore
            doc.ref.update({
              [`timeSlots.${timeSlots.indexOf(slot)}.reminderSent`]: true,
            });
          })
          .catch((error) => {
            console.error('Error sending reminder email:', error);
          });
      }
    });
  });

  return null;
});

// Function to send a reminder 1 hour before the appointment
exports.sendOneHourReminder = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
  const currentDate = DateTime.now().setZone('UTC');
  const oneHourLater = currentDate.plus({ hours: 1 }).toISO();

  // Query schedules that have appointments within the next hour
  const schedulesSnapshot = await admin.firestore().collection('schedules').get();
  
  schedulesSnapshot.forEach((doc) => {
    const schedule = doc.data();
    const timeSlots = schedule.timeSlots;

    timeSlots.forEach((slot) => {
      if (slot.startTime <= oneHourLater && slot.startTime > currentDate.toISO() && !slot.hourReminderSent) {
        const doctorFullName = `Dr. ${schedule.doctorFirstName[0]}. ${schedule.doctorLastName}`;
        const patientFullName = `${slot.bookerName.firstName[0]}. ${slot.bookerName.lastName}`;
        const appointmentTime = DateTime.fromISO(slot.startTIme).toLocaleString(DateTime.DATETIME_FULL);

        // Email Content
        const mailOptions = {
          from: 'fagbenrocoa@gmail.com',
          to: slot.bookerPersonalInformation.email,
          subject: `Appointment Reminder: 1 Hour Left`,
          text: `Reminder: You have an appointment with ${doctorFullName} at ${appointmentTime}.`,
        };

        // Send the email
        transporter.sendMail(mailOptions)
          .then(() => {
            console.log('One-hour reminder email sent:', mailOptions.to);
            // Mark the one-hour reminder as sent in Firestore
            doc.ref.update({
              [`timeSlots.${timeSlots.indexOf(slot)}.hourReminderSent`]: true,
            });
          })
          .catch((error) => {
            console.error('Error sending one-hour reminder email:', error);
          });
      }
    });
  });

  return null;
});
