import { config } from "dotenv";
config();

const pathDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4lbvqw.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0`;
export { pathDB };
