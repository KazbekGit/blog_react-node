import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

export const createToken = (id) =>
  jwt.sign({ id }, process.env.CREATE_TOKEN_KEY, {
    expiresIn: "1h",
  });

export const getPassHash = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  if (isNaN(saltRounds) || saltRounds <= 0) {
    throw new Error("SALT_ROUNDS must be a positive integer");
  }
  const salt = await bcrypt.genSalt(saltRounds);
  const passHash = await bcrypt.hash(password, salt);
  return passHash;
};
