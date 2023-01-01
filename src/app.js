import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set("port", process.env.PORT || 4000);
app.use(express.static(join(__dirname, "public")));

// Middlewares

// Routes

export { app };
