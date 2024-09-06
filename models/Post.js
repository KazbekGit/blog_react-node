import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Post", PostSchema);
