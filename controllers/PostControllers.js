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
  const postId = req.params.id;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const result = await PostModel.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "The post is not found" });
    }

    return res
      .status(200)
      .json({ message: "The post is successfully deleted" });
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateOne = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ err: `Post ID is required` });
  const { title, body, tags, avatarURL } = req.body;

  try {
    const updatedPost = {};
    if (title) updatedPost.title = title;
    if (body) updatedPost.body = body;
    if (tags) updatedPost.tags = tags;
    if (avatarURL) updatedPost.avatarURL = avatarURL;
    updatedPost.author = req.userId;

    if (Object.keys(updatedPost).length === 1)
      return res
        .status(400)
        .json({ err: "At least one field is require to update" });

    const result = await PostModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ...updatedPost,
        },
      }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ err: "Can't update post" });

    res.status(200).json({ message: "Post was updated" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ err: error.message });
  }
};
