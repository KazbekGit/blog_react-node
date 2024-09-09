import { validationResult } from "express-validator";
import PostModel from "../models/Post.js";

export const createPost = (req, res) => {
  const { title, body, tags, avatarURL } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ err: errors });

  try {
    const post = new PostModel({
      title,
      body,
      tags,
      avatarURL,
      author: req.userId,
    });

    res.status(200).json({ post: post.toObject() });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
