import mongoose from "mongoose";
import AnswerModel, { AnswerDocument } from "../model/answer.model";
import practiceService from "./practice.service";
import userService from "./user.service";
import { removeFile } from "../utils/removeFile";

export class Answer {
  readonly Answer: mongoose.Model<AnswerDocument>;
  constructor(Answer: mongoose.Model<AnswerDocument>) {
    this.Answer = Answer;
  }
  async add(answer: {
    user_id: string;
    createdBy: string;
    practice_id: string;
    file?: string;
    description?: string;
  }) {
    await practiceService.getOne(answer.practice_id, answer.user_id);
    const newAnswer = new this.Answer(answer);
    await newAnswer.save();
    return await this.getAll(answer.practice_id);
  }
  async edit(answer: {
    createdBy: string;
    answer_id: string;
    file?: string;
    description?: string;
  }) {
    const answerToEdit = await this.Answer.findOneAndUpdate(
      {
        _id: answer.answer_id,
        createdBy: answer.createdBy, //check answer for user
      },
      {
        file: answer.file,
        description: answer.description,
      }
    );
    if (!answerToEdit) {
      throw {
        code: 404,
        message: "پاسخ یافت نشد",
      };
    }
    if (answer.file) {
      removeFile(`/public/files/practice/${answerToEdit.file}`);
    }
    return await this.getAll(answerToEdit.practice_id);
  }
  async delete(_id: string, createdBy: string) {
    const answer = await this.Answer.findOne({
      _id,
      createdBy,
    });
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ یافت نشد",
      };
    }
    await answer.remove();
    return await this.getAll(answer.practice_id);
  }
  async getAll(practice_id: any) {
    const answers = await this.Answer.find(
      { practice_id },
      { rateListDown: 0, rateListUp: 0 },
      {
        sort: {
          rate: -1,
        },
      }
    );
    if (!answers) {
      throw {
        code: 404,
        message: "پاسخ یافت نشد",
      };
    }
    return answers;
  }
  async increaseRate(answer_id: string, user_id: string) {
    const answer = await this.Answer.findById(answer_id);
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ یافت نشد",
      };
    }
    if (answer.rateListDown.includes(user_id)) {
      answer.rateListDown.splice(answer.rateListDown.indexOf(user_id), 1);
    } else {
      if (!answer.rateListUp.includes(user_id)) answer.rateListUp.push(user_id);
    }
    answer.rate = answer.rateListUp.length - answer.rateListDown.length;
    await answer.save();
    return await this.getAll(answer.practice_id);
  }
  async decreaseRate(answer_id: string, user_id: string) {
    const answer = await this.Answer.findById(answer_id);
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ یافت نشد",
      };
    }
    if (answer.rateListUp.includes(user_id)) {
      answer.rateListUp.splice(answer.rateListUp.indexOf(user_id), 1);
    } else {
      if (!answer.rateListDown.includes(user_id))
        answer.rateListDown.push(user_id);
    }
    answer.rate = answer.rateListUp.length - answer.rateListDown.length;
    await answer.save();
    return await this.getAll(answer.practice_id);
  }
}

export default new Answer(AnswerModel);
