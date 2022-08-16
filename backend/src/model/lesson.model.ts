import mongoose from "mongoose";
import PracticeModel from "./practice.model";

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
});

const Lesson = mongoose.model<LessonDocument>("Lesson", LessonSchema);

export default Lesson;
