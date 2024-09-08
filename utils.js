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

export const isAuth = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.CREATE_TOKEN_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    } else {
      return res.status(401).json({ message: "No token" });
    }
  }
};
