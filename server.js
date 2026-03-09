import authRoutes from "./routes/authRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', "https://as-todo-application.vercel.app"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Error connecting to MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Hi From Server | MongoDB Successfully Connected!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
})

// export default app;