import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToMongodb, connectToRedis } from "./db";
import errorhandler from "./middleware/errorhandler";
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
app.use(errorhandler);
connectToMongodb()
  .then(() => {
    connectToRedis()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log(`Server is running on port ${process.env.PORT}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});
