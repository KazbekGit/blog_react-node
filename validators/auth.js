import { body } from "express-validator";

export const registerValidators = [
  body("fullName", "name is not valid")
    .isAlphanumeric()
    .isLength({ min: 3, max: 30 }),
  body("email", "email is not valid").isEmail().isLength({ min: 3, max: 30 }),
  body(
    "password",
    "Пароль должен содержать хотя бы 8 спецсимволов, бб, мб и т.д. и т.п."
  ).isLength({ min: 8, max: 30 }),
  body("avatar", "avatar must be URL").optional().isURL(),
];

export const loginValidators = [
  body("email", "Please input valid email")
    .isEmail()
    .isLength({ min: 3, max: 30 }),
  body("password", "Please input valid password").isLength({ min: 3, max: 30 }),
];
