import { pathDB } from '../vars.js';
import mongoose from 'mongoose';
import {config} from 'dotenv';

config()

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(pathDB);
        console.log("DB connection is successful. Happy hacking...");
      } catch (err) {
        console.error("DB connection error:", err);
      }
}