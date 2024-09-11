import { validationResult } from "express-validator";
import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
  const { title, body, tags, avatarURL } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ err: errors.array() });

  try {
    const post = new PostModel({
      title,
      body,
      tags,
      avatarURL,
      author: req.userId,
    });

    const savedPost = await post.save();
    return res.status(201).json({ post: savedPost.toObject() });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({
        path: "author",
        select: "fullName email avatar",
      })
      .select("-__v")
      .lean();
    return res.status(400).json({ posts });
  } catch (error) {
    return res.status(200).json({ err: error.message });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const post = await PostModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $inc: { views: 1 } },
      {
        returnDocument: "after",
      }
    )
      .populate({
        path: "author",
        select: "fullName email avatar",
      })
      .select("-__v")
      .lean();
    return res.status(400).json({ post });
  } catch (error) {
    return res.status(200).json({ err: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const result = PostModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
      return res.status(400).json({ message: "The post is not found" });
    else {
      return res
        .status(200)
        .json({ message: "The post is successfull deleted" });
    }
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
