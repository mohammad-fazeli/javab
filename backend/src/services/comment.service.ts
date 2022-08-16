import mongoose from "mongoose";
import { Answer } from "./answer.service";
import AnswerModel, { AnswerDocument } from "../model/answer.model";

// class comment extends Answer
class Comment extends Answer {
  constructor(answerModel: mongoose.Model<AnswerDocument>) {
    super(answerModel);
  }
  async addComment(
    comment: {
      content: string;
      parent?: string;
      createdBy: string;
    },
    answer_id?: string
  ) {
    let replayTo: string | undefined;
    let _id = answer_id;
    if (comment.parent) {
      const commentParent = await this.Answer.findOne({
        "comments._id": comment.parent,
      });
      if (!commentParent) {
        throw {
          code: 404,
          message: "نظر مورد نظر یافت نشد",
        };
      }

      replayTo = commentParent?.comments.find((c: any) => {
        return c._id.toString() == comment.parent;
      })?.createdBy;
      if (!replayTo) {
        throw {
          code: 404,
          message: "نظر مورد نظر یافت نشد",
        };
      }
      _id = commentParent?._id;
    }
    const answer = await this.Answer.findOneAndUpdate(
      { _id },
      {
        $push: {
          comments: {
            content: comment.content,
            createdBy: comment.createdBy,
            replayTo,
            parent: comment.parent,
          },
        },
      }
    );
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ مورد نظر یافت نشد",
      };
    }

    return await this.getAll(answer.practice_id);
  }
  async editComment(content: string, userName: string, comment_id: string) {
    const answer = await this.Answer.findOneAndUpdate(
      { "comments._id": comment_id, "comments.createdBy": userName },
      {
        $set: {
          "comments.$[s].content": content,
          "comments.$[s].edited": true,
        },
      },
      {
        arrayFilters: [{ "s._id": comment_id }],
      }
    );
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ مورد نظر یافت نشد",
      };
    }

    return await this.getAll(answer.practice_id);
  }
  async deleteComment(userName: string, comment_id: string) {
    const answer = await this.Answer.findOneAndUpdate(
      { "comments.createdBy": userName, "comments._id": comment_id },
      {
        $pull: {
          comments: {
            _id: comment_id,
          },
        },
      }
    );
    if (!answer) {
      throw {
        code: 404,
        message: "پاسخ مورد نظر یافت نشد",
      };
    }

    return await this.getAll(answer.practice_id);
  }
}

export default new Comment(AnswerModel);
