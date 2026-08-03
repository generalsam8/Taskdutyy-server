import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/DB";
import taskRoute from "./routes/TaskRoutes";
import userRoute from "./routes/UserRoutes";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Task Manager Server");
});

app.use("/api/tasks", taskRoute);
app.use("/api/user/auth", userRoute);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
});