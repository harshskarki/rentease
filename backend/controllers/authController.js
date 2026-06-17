const User = require('../models/User');
const { generateOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/emailService');

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ name, email, password, phone, otp, otpExpires });

    let emailSent = true;
    try {
      await sendOTPEmail(email, name, otp);
    } catch (emailErr) {
      console.error('OTP email error:', emailErr.message);
      emailSent = false;
    }

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: emailSent ? 'Account created. Please verify your email with the OTP sent.' : 'Account created. Email delivery unavailable in test mode - OTP shown below.',
      token,
      devOtp: emailSent ? undefined : otp,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role, isVerified: user.isVerified },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id).select('+otp +otpExpires');

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    let emailSent = true;
    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailErr) {
      console.error('OTP email error:', emailErr.message);
      emailSent = false;
    }

    res.json({
      success: true,
      message: emailSent ? 'OTP resent successfully!' : 'Email delivery unavailable in test mode - OTP shown below.',
      devOtp: emailSent ? undefined : otp,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role, isVerified: user.isVerified },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe, verifyOTP, resendOTP };
