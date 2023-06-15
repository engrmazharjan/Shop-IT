// * Create And Send Token And Save In The Cookie
const sendToken = (user, statusCode, res) => {
  // * Create JWT Token
  const token = user.getJwtToken();

  // * Options For Cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
module.exports = sendToken;
