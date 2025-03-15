const jwt = require("jsonwebtoken");
const { unauthorizedErrorResponse } = require("../utils");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return unauthorizedErrorResponse(
      res,
      "Access Denied",
      "No token provided",
      401
    );

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    unauthorizedErrorResponse(res, err, "Invalid token", 401);
  }
};
