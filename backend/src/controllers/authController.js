const { authService } = require("../services");
const { successResponse, errorResponse } = require("../utils");
const {
  validateRegister,
  validateLogin,
} = require("../validations/authValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_UNAUTHORIZED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
} = require("../utils/constants");

exports.registerUser = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error)
    return errorResponse(res, error.details[0].message, STATUS_BAD_REQUEST);

  try {
    const existingUser = await authService.getUserByEmail(req.body.email);
    if (existingUser) {
      return errorResponse(
        res,
        null,
        "Email already exists",
        STATUS_BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await authService.createUser({
      ...req.body,
      password: hashedPassword,
    });
    delete user.password;
    successResponse(res, user, "User registered successfully", STATUS_CREATED);
  } catch (error) {
    errorResponse(res, error, "Registration failed", STATUS_INTERNAL_ERROR);
  }
};

exports.loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error)
    return errorResponse(res, error.details[0].message, STATUS_BAD_REQUEST);

  try {
    const user = await authService.getUserByEmail(req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return errorResponse(
        res,
        null,
        "Invalid credentials",
        STATUS_UNAUTHORIZED
      );
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user.password;
    successResponse(res, { user, token }, "Login successful", STATUS_OK);
  } catch (error) {
    errorResponse(res, error, "Login failed", STATUS_INTERNAL_ERROR);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(Number(req.params.userId));
    if (!user)
      return errorResponse(res, null, "User not found", STATUS_BAD_REQUEST);

    delete user.password;
    successResponse(res, user, "User profile retrieved", STATUS_OK);
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to get user profile",
      STATUS_INTERNAL_ERROR
    );
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUser(
      Number(req.params.userId),
      req.body
    );
    delete updatedUser.password;
    successResponse(res, updatedUser, "User profile updated", STATUS_OK);
  } catch (error) {
    errorResponse(
      res,
      error,
      "Failed to update user profile",
      STATUS_INTERNAL_ERROR
    );
  }
};
