import { pathDB } from "./vars.js";
import express from "express";
import { registerValidators, loginValidators } from "./validators/auth.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as UserRegister from "./controllers/UserControllers.js";

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
    UserRegister.register;
  } catch (error) {
    console.log(error.message);
  }
});
app.post("/login", loginValidators, async (req, res) => {
  try {
    UserRegister.login;
  } catch (error) {
    console.log(error.message);
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
