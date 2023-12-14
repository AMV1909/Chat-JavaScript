import mongoose from "mongoose";
import { config } from "dotenv";

config();

const mongodbConnection = await mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: process.env.MONOGODB_NAME,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

export { mongodbConnection };
