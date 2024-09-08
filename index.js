import { pathDB } from "./vars.js";
import express from "express";
import { registerValidators, loginValidators } from "./validators/validate.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as UserController from "./controllers/UserControllers.js";
import { isAuth } from "./utils.js";
import User from "./models/User.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("<h3>mainPage</h3>");
});

app.post("/register", registerValidators, async (req, res) => {
  try {
    UserController.register(req, res);
  } catch (error) {
    console.log(error.message);
  }
});
app.post("/login", loginValidators, async (req, res) => {
  try {
    UserController.login(req, res);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/user/profile", isAuth, async (req, res) => {

  try {
    const user = await User.findById(req.userId); // Используем await для получения пользователя

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Убираем пароль из объекта пользователя
    const { password, ...clearUser } = user.toObject(); // Используем toObject() для преобразования в обычный объект

    return res.status(200).json({ user: clearUser }); // Возвращаем очищенные данные пользователя
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app
  .listen(process.env.DB_PORT || 5000, async () => {
    console.log(`Server started on port ${process.env.DB_PORT}`);
    console.log(`Connecting to DB...`);

    await mongoose
      .connect(pathDB)
      .then(() => {
        console.log("DB connect is successfull. Happy hacking...");
      })
      .catch((err) => console.log(err));
  })
  .on("error", (err) => {
    console.log(`Server crashed`, err);
  });
