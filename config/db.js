import { pathDB } from '../vars.js';
import mongoose from 'mongoose';
import {config} from 'dotenv';

config()

/**
 * Connects to the MongoDB database using the connection string from the environment variables.
 * Logs a success message to the console if the connection is successful, or an error message if the connection fails.
 */
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(pathDB);
        console.log("DB connection is successful. Happy hacking...");
      } catch (err) {
        console.error("DB connection error:", err);
      }
}