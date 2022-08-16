import mongoose from "mongoose";
import { removeFile } from "../utils/removeFile";

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      required: false,
      default: null,
    },
    replayTo: {
      type: String,
      required: false,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface AnswerDocument extends mongoose.Document {
  createdBy: string;
  practice_id: mongoose.Schema.Types.ObjectId;
  file: string;
  description: string;
  rate: number;
  rateListUp: [string];
  rateListDown: [string];
  comments: [
    {
      content: string;
      parent?: string;
      replayTo?: string;
      createdBy: string;
      edited?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    practice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practice",
      required: true,
    },
    file: { type: String, required: false },
    description: { type: String, required: false },
    rate: { type: Number, required: true, default: 0 },
    rateListUp: { type: Array, required: false, default: [] },
    rateListDown: { type: Array, required: false, default: [] },
    comments: { type: [CommentSchema], required: false, default: [] },
  },
  {
    timestamps: true,
  }
);

AnswerSchema.pre<AnswerDocument>("remove", function (next) {
  if (this.file) {
    removeFile(`/public/files/practice/${this.file}`);
  }
  next();
});

const Answer = mongoose.model<AnswerDocument>("Answer", AnswerSchema);

export default Answer;
