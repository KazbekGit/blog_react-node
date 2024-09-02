import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import { getPassHash, getToken } from "../utils.js";

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

    const passHash = await getPassHash(password);

    const newUser = new UserModel({
      fullName: fullName,
      password: passHash,
      email: email,
      avatar: avatar,
    });

    const token = getToken(newUser._id);

    await newUser.save();
    const { password: _, ...newUserRest } = newUser._doc;
    res
      .status(200)
      .json({ message: "User was created!", user: newUserRest, token });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "User saving error", details: err.message });
  }
};
