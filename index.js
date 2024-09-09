import express from "express";
import {
  registerValidators,
  loginValidators,
  postValidators,
} from "./validators/validate.js";
import cors from "cors";
import * as UserController from "./controllers/UserControllers.js";
import * as PostControllers from "./controllers/PostControllers.js";
import { isAuth } from "./utils.js";
import { connectToDatabase } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
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

app.post("/posts", isAuth, postValidators, PostControllers.createPost);

app
  .listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await connectToDatabase();
  })
  .on("error", (err) => {
    console.log(`Server crashed`, err.message);
  });
