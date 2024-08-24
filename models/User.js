import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (value) => {
          /^(ftp|http|https):\/\/[^ "]+$/.test(value);
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
