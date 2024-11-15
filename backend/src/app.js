import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

// CORS setup
app.use(
    cors({
        credentials: true,
    })
);

// JSON and URL-encoded parser setup
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static file serving from the public directory
app.use("/temp", express.static(path.join(__dirname, "public/temp")));

// Routes setup
import {router as userRouter} from "./routes/user.routes.js"
app.use("/user", userRouter);

// Export the app
export { app };
