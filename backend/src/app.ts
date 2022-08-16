import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
//import routers
import userRouter from "./router/user.router";
import lessonRouter from "./router/lesson.router";
import practiceRouter from "./router/practice.router";
import answerRouter from "./router/answer.router";
import commentRouter from "./router/comment.router";

dotenv.config({ path: ".env" });

const app: Express = express();

app.use(express.static("public"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/practice", practiceRouter);
app.use("/api/answer", answerRouter);
app.use("/api/comment", commentRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
