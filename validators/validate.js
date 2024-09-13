import { body } from "express-validator";

export const registerUserValidators = [
  body("fullName")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username 3 - 30 chars")
    .matches(/^[a-zA-Z0-9\s\-\_\.\,]+$/)
    .notEmpty()
    .withMessage("Username cannot be empty or consist of spaces")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Email cannot be empty or consist of spaces")
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .notEmpty()
    .trim(),
  body(
    "password",
    "Пароль должен содержать хотя бы 8 спецсимволов, бб, мб и т.д. и т.п."
  )
    .isLength({ min: 3, max: 30 })
    .notEmpty()
    .withMessage("Pass cannot be empty or consist of spaces")
    .trim(),
  body("avatar", "avatar must be URL").optional().isURL().notEmpty().trim(),
];

export const loginValidators = [
  body("email", "Please input valid email")
    .isEmail()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
];

export const postValidators = [
  body("title", "Title length must be more then 3 chars").isString().isLength({
    min: 3,
    max: 250,
  }),
  body("body", "Body length must be more then 3 chars").isString().isLength({
    min: 3,
    max: 750,
  }),
  body("tags", "must be array").optional().isArray(),
  body("views", "must be integer").optional().isInt({ gt: 0 }),
];
