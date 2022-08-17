import mongoose from "mongoose";
import AnswerModel from "./answer.model";
import UserModel from "./user.model";
import { removeFile } from "../utils/removeFile";

export interface PracticeDocument extends mongoose.Document {
  lesson: mongoose.Types.ObjectId;
  title: string;
  question: string;
  file: string;
  description: string;
  views: [mongoose.Types.ObjectId];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    title: { type: String, required: true },
    question: { type: String, required: true },
    file: { type: String, required: false },
    description: { type: String, required: false },
    views: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PracticeSchema.pre<PracticeDocument>("remove", async function (next) {
  if (this.file) {
    removeFile(`/public/files/practice/${this.file}`);
  }
  const answers = await AnswerModel.find({ practice_id: this._id });
  for (const answer of answers) {
    await answer.remove();
  }
  const users = await UserModel.find({
    saved: { $in: [{ _id: this._id, title: this.title }] },
  });
  for (const user of users) {
    user.saved = user.saved.filter(
      (saved) => saved._id.toString() !== this._id.toString()
    );
    await user.save();
  }
  next();
});

const Practice = mongoose.model<PracticeDocument>("Practice", PracticeSchema);

export default Practice;
