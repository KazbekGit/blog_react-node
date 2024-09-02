import mongoose from "mongoose";
import crypto from 'crypto'

console.log(crypto.randomBytes(64).toString('hex'))

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
          return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
