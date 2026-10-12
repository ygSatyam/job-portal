import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js"; 

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // to read JSON data from the frontend
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});