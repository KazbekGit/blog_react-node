import UserModel from "../models/User.js";
import { createToken } from "../utils.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
  if (!req.userId) return res.status(400).json({ err: "User ID is not exist" });
  try {
    const user = await UserModel.findById(req.userId); // Используем await для получения пользователя
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Убираем пароль из объекта пользователя
    const { password, ...clearUser } = user.toObject(); // Используем toObject() для преобразования в обычный объект

    return res.status(200).json({ user: clearUser }); // Возвращаем очищенные данные пользователя
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, fullName, avatar } = req.body;

    const currUser = await UserModel.findOne({ email: email });
    if (currUser)
      return res
        .status(400)
        .json({ error: `user with ${email} already exist` });

    const newUser = new UserModel({
      fullName,
      password,
      email,
      avatar,
    });

    const token = createToken(newUser._id);

    // user save to MongoDB
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ error: "Please input valid data" });

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) return res.json({ error: "Please input valid data" });
    const token = createToken(user._id);
    const { password: _, ...userRest } = user.toObject();

    res.status(200).json({ userRest, token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
