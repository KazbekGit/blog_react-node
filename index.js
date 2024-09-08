import { pathDB } from "./vars.js";
import express from "express";
import { registerValidators, loginValidators } from "./validators/validate.js";
import cors from "cors";
import * as UserController from "./controllers/UserControllers.js";
import { isAuth } from "./utils.js";
import {connectToDatabase} from "./config/db.js";

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

app.post("/register", registerValidators, UserController.register);
app.post("/login", loginValidators, UserController.login);
app.get("/user/profile", isAuth, UserController.getProfile);

app
  .listen(process.env.DB_PORT || 5000, async () => {
    console.log(`Server started on port ${process.env.DB_PORT}`);
    await connectToDatabase();})
  .on("error", (err) => {
    console.log(`Server crashed`, err.message);
  });
