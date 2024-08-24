import { pathDB } from "./vars.js";
import express from "express";
import { validators } from "./validators/auth.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "./models/User.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const SALT_ROUNDS = 10;
const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("<h3>mainPage</h3>");
});

app.post("/register", validators, async (req, res) => {
  try {
    const { email, password, fullName, avatar } = req.body;

    const currUser = await UserModel.findOne({ email: email });
    if (currUser)
      return res
        .status(400)
        .json({ error: `user with ${email} already exist` });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passHash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullName: fullName,
      password: passHash,
      email: email,
      avatar: avatar,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.CREATE_TOKEN_KEY, {
      expiresIn: "1h",
    });

    newUser.token = token;
    console.log(newUser);
    newUser
      .save()
      .then(() => {
        const { password, ...newUserRest } = newUser._doc;
        res
          .status(200)
          .send({ message: "User was created!", userInfo: newUserRest });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err: err });
      });
  } catch (err) {
    return res.status(500).json({ err: "User saving error" });
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app
  .listen(process.env.DB_PORT, async () => {
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
