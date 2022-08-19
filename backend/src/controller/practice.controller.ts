import { Request, Response } from "express";
import practiceService from "../services/practice.service";
import userService from "../services/user.service";
import answerService from "../services/answer.service";
import mongoose from "mongoose";
import { removeFile } from "../utils/removeFile";
import { compress } from "../utils/resizeImage";

export const getPractices = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const practices = await practiceService.getAll(id);
    res.status(200).json({
      status: 200,
      message: "تمرینات با موفقیت ارسال شد",
      ...practices,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "درسی یافت نشد",
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const getPractice = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const viewerId = req.user._id;
    const practice = await practiceService.getOne(id, viewerId);
    const answers = await answerService.getAll(id);
    res.status(200).json({
      status: 200,
      message: "تمرین با موفقیت ارسال شد",
      data: {
        practice,
        answers,
      },
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

export const createPractice = async (req: any, res: Response) => {
  const { title, question, description, lesson } = req.body;
  const file = req.file;
  try {
    const user = await userService.findOneByEmail(req.user.email);
    if (
      user.admin ||
      user.lessons.includes(new mongoose.Types.ObjectId(lesson))
    ) {
      if (file) {
        await compress(file.filename);
      }
      const practices = await practiceService.create({
        createdBy: user.name,
        lesson,
        title,
        question,
        description,
        file: file ? file.filename : undefined,
      });
      return res.status(201).json({
        status: 201,
        message: "تمرین با موفقیت ایجاد شد",
        ...practices,
      });
    }
    res.status(401).json({
      status: 401,
      message: "شما دسترسی لازم برای این درس را ندارید",
    });
  } catch (err: any) {
    if (file) removeFile(`/public/files/practice/${file.filename}`);
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "درس مورد نظر یافت نشد",
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const editPractice = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, question, description } = req.body;

  const file = req.file;
  try {
    const user = await userService.findOneByEmail(req.user.email);
    const practice = await practiceService.getOne(id, user._id);

    if (user.admin || user.lessons.includes(practice.lesson)) {
      if (file) {
        await compress(file.filename);
      }
      const practices = await practiceService.edit(id, {
        title,
        question,
        description,
        file: file ? file.filename : undefined,
      });
      return res.status(200).json({
        status: 200,
        message: "تمرین با موفقیت ویرایش شد",
        ...practices,
      });
    }
    res.status(401).json({
      status: 401,
      message: "شما دسترسی لازم برای این درس را ندارید",
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "تمرین یافت نشد",
      });
    }
    if (file) removeFile(`/public/files/practice/${file.filename}`);
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const deletePractice = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.findOneByEmail(req.user.email);
    const practice = await practiceService.getOne(id, user._id);
    if (user.admin || user.lessons.includes(practice.lesson)) {
      const practices = await practiceService.delete(id);
      return res.status(200).json({
        status: 200,
        message: "تمرین با موفقیت حذف شد",
        ...practices,
      });
    }
    res.status(401).json({
      status: 401,
      message: "شما دسترسی لازم برای این درس را ندارید",
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "تمرین یافت نشد",
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};
