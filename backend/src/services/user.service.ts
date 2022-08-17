import mongoose from "mongoose";
import UserModel, { UserDocument } from "../model/user.model";
import bcrypt from "bcryptjs";
import practiceService from "./practice.service";

class User {
  private userModel: mongoose.Model<UserDocument>;
  constructor(userModel: mongoose.Model<UserDocument>) {
    this.userModel = userModel;
  }
  async create(user: { name: string; email: string; password: string }) {
    if (user.name === "کاربر حذف شده") {
      throw new Error("کاربر حذف شده");
    }
    const newUser = new this.userModel(user);
    return await newUser.save();
  }
  async verify(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    if (user.verified) {
      throw {
        code: 400,
        message: "حساب کاربری شما قبلا تایید شده است",
      };
    }
    user.verified = true;
    return await user.save();
  }
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw {
        code: 401,
        message: "نام کاربری یا رمز عبور اشتباه است",
      };
    }
    if (!user.verified) {
      throw {
        code: 401,
        message: "حساب کاربری شما فعال نشده است",
      };
    }
    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      throw {
        code: 401,
        message: "نام کاربری یا رمز عبور اشتباه است",
      };
    }
    return user;
  }
  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user;
  }
  async findOneById(_id: any) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user;
  }
  async restPassword(email: string, password: string) {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { password: bcrypt.hashSync(password) },
      { new: true }
    );
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user;
  }
  async changePassword(_id: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    const isMatch = user.comparePassword(oldPassword);
    if (!isMatch) {
      throw {
        code: 401,
        message: "رمز عبور قدیمی اشتباه است",
      };
    }
    user.password = newPassword;
    return await user.save();
  }
  async delete(_id: string, password: string) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      throw {
        code: 401,
        message: "رمز عبور اشتباه است",
      };
    }
    return await user.remove();
  }
  async addSavedPractice(user_id: string, practice_id: string) {
    const practice = await practiceService.getOne(practice_id, user_id);
    const user = await this.userModel.findOneAndUpdate(
      { _id: user_id },
      {
        $addToSet: {
          saved: { _id: practice._id, title: practice.title },
        },
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user.saved;
  }
  async removeSavedPractice(user_id: string, practice_id: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: {
          saved: { _id: practice_id },
        },
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user.saved;
  }
  async getSavedPractices(user_id: string) {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user.saved;
  }
  async setLessons(user_id: string, lessons: string[]) {
    const SetLessons = [...new Set(lessons)];
    const user = await this.userModel.findOneAndUpdate(
      { _id: user_id },
      {
        lessons: SetLessons,
      }
    );
    if (!user) {
      throw {
        code: 404,
        message: "کاربری یافت نشد",
      };
    }
    return user;
  }
  async getAll() {
    return await this.userModel.find({ verified: true }, { name: 1, _id: 1 });
  }
}

export default new User(UserModel);
