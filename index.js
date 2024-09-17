import express from "express";
import {
  registerUserValidators,
  loginValidators,
  postValidators,
} from "./validators/validate.js";
import cors from "cors";
import * as UserController from "./controllers/UserControllers.js";
import * as PostControllers from "./controllers/PostControllers.js";
import { isAuth } from "./utils.js";
import { connectToDatabase } from "./config/db.js";
import dotenv from "dotenv";
import { validateResult } from "./validators/validateResult.js";
import multer from "multer";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(
  cors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("<h3>mainPage</h3>");
});

app.post("/register", registerUserValidators, UserController.register);
app.post("/login", loginValidators, UserController.login);

app.get("/posts", postValidators, PostControllers.getAllPosts);
app.get("/posts/:id", postValidators, PostControllers.getOnePost);

app.get("/user/profile", isAuth, UserController.getProfile);
app.post(
  "/posts",
  isAuth,
  postValidators,
  validateResult,
  PostControllers.createPost
);
app.delete(
  "/posts/:id",
  isAuth,
  postValidators,
  PostControllers.deletePost
);
app.patch(
  "/posts/:id",
  isAuth,
  postValidators,
  validateResult,
  PostControllers.updatePost
);

app.get("/upload", isAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ err: "File was not uploaded" });
  return res.status(200).json({ message: "File was successfully uploaded" });
});

app
  .listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await connectToDatabase();
  })
  .on("error", (err) => {
    console.log(`Server crashed`, err.message);
  });
