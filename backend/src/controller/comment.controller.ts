import { Request, Response } from "express";
import commentService from "../services/comment.service";

export const addComment = async (req: any, res: Response) => {
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
        createdBy: req.user.name,
      },
      answer_id
    );
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت اضافه شد",
      data: answers,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const editComment = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const answers = await commentService.editComment(
      content,
      req.user.name,
      id
    );
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت ویرایش شد",
      data: answers,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const deleteComment = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const answers = await commentService.deleteComment(req.user.name, id);
    res.status(200).json({
      status: 200,
      message: "نظر با موفقیت حذف شد",
      data: answers,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};
