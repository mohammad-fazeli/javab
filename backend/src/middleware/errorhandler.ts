import { Response } from "express";
import { Request } from "../types/request";

export default function errorhandler(req: Request, res: Response) {
  if (req.error?.code) {
    return res.status(req.error.code).json({
      status: req.error.code,
      message: req.error.message,
    });
  }
  console.log(req.error);
  return res.status(500).json({
    status: 500,
    message: "خطایی رخ داده است.",
  });
}
