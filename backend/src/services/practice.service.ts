import mongoose from "mongoose";
import PracticeModel, { PracticeDocument } from "../model/practice.model";
import { removeFile } from "../utils/removeFile";
import lessonService from "./lesson.service";

class Practice {
  private practiceModel: mongoose.Model<PracticeDocument>;
  constructor(practiceModel: mongoose.Model<PracticeDocument>) {
    this.practiceModel = practiceModel;
  }
  async getAll(id: string) {
    const lesson = await lessonService.getOne(id);
    const practices = await this.practiceModel.find(
      {
        lesson: id,
      },
      { title: 1, _id: 1 }
    );
    if (!practices) {
      throw {
        code: 404,
        message: "تمرین یافت نشد",
      };
    }
    return {
      title: lesson.title,
      data: practices,
    };
  }
  async create(practice: {
    createdBy: string;
    lesson: string;
    title: string;
    question: string;
    file?: string;
    description?: string;
  }) {
    const lesson = await lessonService.getOne(practice.lesson);
    const newPractice = new this.practiceModel({
      ...practice,
      lesson: lesson._id,
    });
    await newPractice.save();
    return await this.getAll(practice.lesson);
  }
  async edit(
    id: string,
    practice: {
      title?: string;
      question?: string;
      file?: string;
      description?: string;
    }
  ) {
    const practiceToEdit = await this.practiceModel.findOneAndUpdate(
      { _id: id },
      practice
    );
    if (!practiceToEdit) {
      throw {
        code: 404,
        message: "تمرین یافت نشد",
      };
    }
    if (practice.file) {
      removeFile(`/public/files/practice/${practiceToEdit.file}`);
    }
    return await this.getAll(practiceToEdit.lesson.toString());
  }
  async delete(id: string) {
    const practiceToDelete = await this.practiceModel.findById(id);
    if (!practiceToDelete) {
      throw {
        code: 404,
        message: "تمرین یافت نشد",
      };
    }
    await practiceToDelete.remove();
    return await this.getAll(practiceToDelete.lesson.toString());
  }
  async getOne(id: string, viewerId: string) {
    try {
      const practice = await this.practiceModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            views: viewerId,
          },
        },
        {
          new: true,
        }
      );

      if (!practice) {
        throw {
          code: 404,
          message: "تمرین یافت نشد",
        };
      }
      return {
        _id: practice._id,
        lesson: practice.lesson,
        title: practice.title,
        question: practice.question,
        file: practice.file,
        description: practice.description,
        views: practice.views.length,
        createdBy: practice.createdBy,
        createdAt: practice.createdAt,
        updatedAt: practice.updatedAt,
      };
    } catch {
      throw {
        code: 404,
        message: "تمرین یافت نشد",
      };
    }
  }
}

export default new Practice(PracticeModel);
