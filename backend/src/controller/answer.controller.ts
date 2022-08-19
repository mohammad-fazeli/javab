import { Request, Response } from "express";
import answerService from "../services/answer.service";
import { removeFile } from "../utils/removeFile";
import { compress } from "../utils/resizeImage";

export const addAnswer = async (req: any, res: Response) => {
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
      user_id: req.user._id,
      createdBy: req.user.name,
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
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "مشکلی به وجود آمده است",
    });
  }
};

export const editAnswer = async (req: any, res: Response) => {
  const { description } = req.body;
  const { answer_id } = req.params;
  const file = req.file;
  try {
    if (file) {
      await compress(file.filename);
    }
    const answers = await answerService.edit({
      createdBy: req.user.name,
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
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "مشکلی به وجود آمده است",
    });
  }
};

export const deleteAnswer = async (req: any, res: Response) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.delete(answer_id, req.user.name);
    res.status(200).json({
      status: 200,
      message: "پاسخ با موفقیت حذف شد",
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
      message: "مشکلی به وجود آمده است",
    });
  }
};

export const increaseRate = async (req: any, res: Response) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.increaseRate(answer_id, req.user.name);
    res.status(200).json({
      status: 200,
      message: "امتیاز با موفقیت بروزرسانی شد",
      data: answers,
    });
  } catch (err: any) {
    console.log("🚀 ~ file: answer.controller.ts ~ line 107 ~ err", err);
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "مشکلی به وجود آمده است",
    });
  }
};

export const decreaseRate = async (req: any, res: Response) => {
  try {
    const { answer_id } = req.params;
    const answers = await answerService.decreaseRate(answer_id, req.user.name);
    res.status(200).json({
      status: 200,
      message: "امتیاز با موفقیت بروزرسانی شد",
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
      message: "مشکلی به وجود آمده است",
    });
  }
};
