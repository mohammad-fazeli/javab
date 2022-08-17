import mongoose from "mongoose";
import PracticeModel from "./practice.model";
import UserModel from "./user.model";

export interface LessonDocument extends mongoose.Document {
  title: string;
}

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

LessonSchema.pre<LessonDocument>("remove", async function (next) {
  const practices = await PracticeModel.find({ lesson: this._id });
  for (const practice of practices) {
    await practice.remove();
  }
  const users = await UserModel.find({
    lessons: { $in: [this._id] },
  });
  for (const user of users) {
    user.lessons = user.lessons.filter(
      (lesson) => lesson.toString() !== this._id.toString()
    );
    await user.save();
  }
  next();
});

const Lesson = mongoose.model<LessonDocument>("Lesson", LessonSchema);

export default Lesson;
