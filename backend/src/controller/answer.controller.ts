import { Response, NextFunction } from "express";
import { Request } from "../types/request";
import answerService from "../services/answer.service";
import { removeFile } from "../utils/removeFile";
import { compress } from "../utils/resizeImage";

export const addAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { practice_id, description } = req.body;
    const file = req.file;
    if (!file && !description) {
      return res.status(400).json({
        code: 400,
        message: "فایل یا توضیح ضروری است",
      });
    }
    if (file) {
      await compress(file.filename);
    }
    const answers = await answerService.add({
      user_id: req.user?._id as string,
      createdBy: req.user?.name as string,
      practice_id,
      description,
      file: file ? file.filename : undefined,
    });
    res.status(201).json({
      status: 201,
      message: "پاسخ با موفقیت ثبت شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const editAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description } = req.body;
  const { answer_id } = req.params;
  const file = req.file;
  try {
    if (file) {
      await compress(file.filename);
    }
    const answers = await answerService.edit({
      createdBy: req.user?.name as string,
      answer_id,
      description,
      file: file ? file.filename : undefined,
    });
    res.status(200).json({
      status: 200,
      message: "پاسخ با موفقیت ویرایش شد",
      data: answers,
    });
  } catch (err: any) {
    if (file) {
      removeFile(`/public/files/practice/${file.filename}`);
    }
    req.error = err;
    next();
  }
};

export const deleteAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.delete(
      answer_id,
      req.user?.name as string
    );
    res.status(200).json({
      status: 200,
      message: "پاسخ با موفقیت حذف شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const increaseRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.increaseRate(
      answer_id,
      req.user?.name as string
    );
    res.status(200).json({
      status: 200,
      message: "امتیاز با موفقیت بروزرسانی شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const decreaseRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.decreaseRate(
      answer_id,
      req.user?.name as string
    );
    res.status(200).json({
      status: 200,
      message: "امتیاز با موفقیت بروزرسانی شد",
      data: answers,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};
