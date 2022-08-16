import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connect from "./db/connect";
import os from "os";
import cluster from "cluster";
//import routers
import userRouter from "./router/user.router";
import lessonRouter from "./router/lesson.router";
import practiceRouter from "./router/practice.router";
import answerRouter from "./router/answer.router";
import commentRouter from "./router/comment.router";

dotenv.config({ path: ".env" });

const clusterWorkerSize = os.cpus().length;

if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork();
    }
    cluster.on("exit", function (worker) {
      console.log("Worker", worker.id, "has exited.");
    });
  } else {
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

    connect()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log(
            `Server is running on port ${process.env.PORT} and worker ${process.pid}`
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });

    app.get("/", (req: Request, res: Response) => {
      res.sendStatus(200);
    });
  }
} else {
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
  connect()
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(
          `Server is running on port ${process.env.PORT} and worker ${process.pid}`
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });

  app.get("/", (req: Request, res: Response) => {
    res.sendStatus(200);
  });
}

// export default app;
