import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AnswerModel from "./answer.model";
import PracticeModel from "./practice.model";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  admin: boolean;
  verified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  lessons: mongoose.Types.ObjectId[];
  saved: { _id: mongoose.Types.ObjectId; title: string }[];
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    saved: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
          require: true,
        },
        title: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<UserDocument>("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password);
  }
  next();
});

UserSchema.post<UserDocument>("remove", async function (doc, next) {
  await PracticeModel.updateMany(
    { createdBy: doc.name },
    { $set: { createdBy: "کاربر حذف شده" } }
  );
  await AnswerModel.updateMany(
    { createdBy: doc.name },
    { $set: { createdBy: "کاربر حذف شده" } }
  );
  next();
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

//remove user after 1h if not verified
UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 3600,
    partialFilterExpression: { verified: false },
  }
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
