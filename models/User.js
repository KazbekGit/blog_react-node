import mongoose from "mongoose";
import crypto from "crypto";
import { getPassHash } from "../utils.js";

console.log(crypto.randomBytes(64).toString("hex"));

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

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await getPassHash(this.password);
    } catch (err) {
      console.log(err.message);
      return next(err);
    }
  }
  next();
});

export default mongoose.model("User", UserSchema);
