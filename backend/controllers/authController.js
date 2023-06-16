const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// * Register A User => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/qltamcyxodrpfaxzd9mb",
      url: "https://res.cloudinary.com/logic-worms/image/upload/v1628167401/avatars/qltamcyxodrpfaxzd9mb.png",
    },
  });

  sendToken(user, 200, res);
});

// * Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // * Check If Email And Password Is Entered By User
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  // * Finding User In Database
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  // * Check If Password Is Correct Or Not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  sendToken(user, 200, res);
});

// * Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found With Email", 404));
  }

  // * Get Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // * Create Reset Password URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token Is As Follow:\n\n${resetUrl}\n\nIf You Have Not Requested This Email Then Ignore It.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Shop-IT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent To: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// * Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // * Hash URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password Reset Token Is Invalid Or Has Been Expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Does Not Match", 400));
  }

  // * Setup New Password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// * Login User => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});
