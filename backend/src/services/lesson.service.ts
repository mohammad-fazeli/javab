import mongoose from "mongoose";
import LessonModel, { LessonDocument } from "../model/lesson.model";

class Lesson {
  private Lesson: mongoose.Model<LessonDocument>;
  constructor(Lesson: mongoose.Model<LessonDocument>) {
    this.Lesson = Lesson;
  }
  async getAll() {
    return await this.Lesson.find();
  }
  async getOne(id: string) {
    const lesson = await this.Lesson.findById(id);
    if (!lesson) {
      throw {
        code: 404,
        message: "درسی یافت نشد",
      };
    }
    return lesson;
  }
  async create(title: string) {
    const newLesson = new this.Lesson({ title });
    await newLesson.save();
    return await this.getAll();
  }
  async edit(id: string, title: string) {
    const lesson = await this.Lesson.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    if (!lesson) {
      throw {
        code: 404,
        message: "درسی یافت نشد",
      };
    }
    return await this.getAll();
  }
  async delete(id: string) {
    const lesson = await this.Lesson.findById(id);
    if (!lesson) {
      throw {
        code: 404,
        message: "درسی یافت نشد",
      };
    }
    await lesson.remove();
    return await this.getAll();
  }
}

export default new Lesson(LessonModel);
