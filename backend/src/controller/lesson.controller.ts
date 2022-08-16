import { Request, Response } from "express";
import lessonService from "../services/lesson.service";

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonService.getAll();
    res.status(200).json({
      status: 200,
      message: "success",
      data: lessons,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const addLesson = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const lessons = await lessonService.create(title);
    res.status(201).json({
      status: 201,
      message: "درس جدید با موفقیت ایجاد شد",
      data: lessons,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: "خطایی در سرور رخ داده است",
    });
  }
};

export const editLesson = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonService.edit(req.params.id, req.body.title);
    res.status(200).json({
      status: 200,
      message: "درس با موفقیت ویرایش شد",
      data: lessons,
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
      message: "خطایی در سرور رخ داده است",
    });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonService.delete(req.params.id);
    res.status(200).json({
      status: 200,
      message: "درس با موفقیت حذف شد",
      data: lessons,
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
      message: "خطایی در سرور رخ داده است",
    });
  }
};
