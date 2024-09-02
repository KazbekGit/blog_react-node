import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { getToken } from "../utils.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { email, password, fullName, avatar } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const currUser = await UserModel.findOne({ email: email });
    if (currUser)
      return res
        .status(400)
        .json({ error: `user with ${email} already exist` });

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passHash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullName: fullName,
      password: passHash,
      email: email,
      avatar: avatar,
    });

    const token = getToken(newUser._id);
    
    newUser
      .save()
      .then(() => {
        const { password, ...newUserRest } = newUser._doc;
        res
          .status(200)
          .json({ message: "User was created!", user: newUserRest, token });
      })
      .catch((err) => {
        res.status(500).json({ err: err });
      });
  } catch (err) {
    return res.status(500).json({ err: "User saving error" });
  }
};
