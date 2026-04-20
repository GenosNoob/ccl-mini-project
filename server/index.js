import express from "express";
import serverless from "serverless-http";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

// Serverless database connection middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    mongoose.set("strictQuery", true);
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to Mongo DB");
    } catch (err) {
      console.error("failed to connect with mongo");
      console.error(err);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.use("/api/user/", UserRoutes.default || UserRoutes);
// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from GFG",
  });
});



// Export the serverless handler
export const handler = serverless(app, { basePath: '/.netlify/functions/index' });

// Keep local development working
if (process.env.NODE_ENV !== "production") {
  app.listen(8080, () => console.log("Server started on port 8080"));
}
