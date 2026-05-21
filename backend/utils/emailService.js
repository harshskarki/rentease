const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmationToOwner = async (ownerEmail, ownerName, renterName, itemTitle, startDate, endDate, totalAmount) => {
  await transporter.sendMail({
    from: `"RentEase" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: 'New Booking Request - RentEase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Booking Request!</h2>
        <p>Hi ${ownerName},</p>
        <p>You have a new booking request for your item <strong>${itemTitle}</strong>.</p>
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>Renter:</strong> ${renterName}</p>
          <p><strong>Item:</strong> ${itemTitle}</p>
          <p><strong>From:</strong> ${new Date(startDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(endDate).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> Rs.${totalAmount}</p>
        </div>
        <p>Login to your dashboard to confirm or reject this booking.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">View Dashboard</a>
        <p style="margin-top: 2rem; color: #6b7280;">RentEase Team</p>
      </div>
    `,
  });
};

const sendBookingStatusToRenter = async (renterEmail, renterName, itemTitle, status, startDate, endDate, totalAmount) => {
  const isConfirmed = status === 'confirmed';
  await transporter.sendMail({
    from: `"RentEase" <${process.env.EMAIL_USER}>`,
    to: renterEmail,
    subject: `Booking ${isConfirmed ? 'Confirmed' : 'Rejected'} - RentEase`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isConfirmed ? '#059669' : '#dc2626'};">Booking ${isConfirmed ? 'Confirmed!' : 'Rejected'}</h2>
        <p>Hi ${renterName},</p>
        <p>Your booking for <strong>${itemTitle}</strong> has been <strong>${status}</strong>.</p>
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>Item:</strong> ${itemTitle}</p>
          <p><strong>From:</strong> ${new Date(startDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(endDate).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> Rs.${totalAmount}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        ${isConfirmed ? '<p>Your booking is confirmed! Enjoy your rental.</p>' : '<p>Sorry, the owner was unable to confirm your booking at this time.</p>'}
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">View Dashboard</a>
        <p style="margin-top: 2rem; color: #6b7280;">RentEase Team</p>
      </div>
    `,
  });
};

module.exports = { sendBookingConfirmationToOwner, sendBookingStatusToRenter };
