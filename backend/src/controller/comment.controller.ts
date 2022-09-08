import { Response, NextFunction } from "express";
import { Request } from "../types/request";
import commentService from "../services/comment.service";

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answer_id, content, parent } = req.body;
    if (!answer_id && !parent) {
      return res.status(400).send({
        code: 400,
        message: "شناسه پاسخ و یا شناسه کامنت ضروری است",
      });
    }
    const answers = await commentService.addComment(
      {
        content,
        parent,
        createdBy: req.user?.name as string,
      },
      answer_id
    );
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت اضافه شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const answers = await commentService.editComment(
      content,
      req.user?.name as string,
      id
    );
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت ویرایش شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const answers = await commentService.deleteComment(
      req.user?.name as string,
      id
    );
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت حذف شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};
