const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, name, otp) => {
  await resend.emails.send({
    from: 'RentEase <onboarding@resend.dev>',
    to: email,
    subject: 'Verify Your Email - RentEase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email</h2>
        <p>Hi ${name},</p>
        <p>Welcome to RentEase! Please use the OTP below to verify your email address:</p>
        <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; text-align: center;">
          <p style="font-size: 2rem; font-weight: bold; color: #2563eb; margin: 0; letter-spacing: 8px;">${otp}</p>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="margin-top: 2rem; color: #6b7280;">RentEase Team</p>
      </div>
    `,
  });
};

const sendBookingConfirmationToOwner = async (ownerEmail, ownerName, renterName, itemTitle, startDate, endDate, totalAmount) => {
  await resend.emails.send({
    from: 'RentEase <onboarding@resend.dev>',
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
        <p style="margin-top: 2rem; color: #6b7280;">RentEase Team</p>
      </div>
    `,
  });
};

const sendBookingStatusToRenter = async (renterEmail, renterName, itemTitle, status, startDate, endDate, totalAmount) => {
  const isConfirmed = status === 'confirmed';
  await resend.emails.send({
    from: 'RentEase <onboarding@resend.dev>',
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
        <p style="margin-top: 2rem; color: #6b7280;">RentEase Team</p>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail, sendBookingConfirmationToOwner, sendBookingStatusToRenter };
