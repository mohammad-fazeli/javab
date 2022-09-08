import { Response, NextFunction } from "express";
import { Request } from "../types/request";
import userService from "../services/user.service";
import emailService from "../services/email.service";
import lessonService from "../services/lesson.service";
import { signToken } from "../utils/auth";
import { client } from "../db";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.create(req.body);
    emailService.sendVerificationEmail(user.email, (err) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: "خطایی در ارسال ایمیل به وجود آمده است",
        });
      } else {
        res.status(201).json({
          status: 201,
          message:
            "ما لینکی را برای تایید حساب کاربری به ایمیل شما ارسال کردیم",
        });
      }
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: 400,
        message: `${err.keyPattern.name ? "نام کاربری" : "ایمیل"} تکراری است`,
      });
    }
    req.error = err;
    next();
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  emailService.verifyVerificationEmail(
    req.params.token,
    async (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: 401,
          message: "لینک تایید حساب کاربری شما نامعتبر است",
        });
      } else {
        try {
          const user = await userService.verify(decoded.email);
          const token = await signToken(user);
          res.status(200).json({
            status: 200,
            message: "حساب کاربری شما تایید شد",
            token,
            user: {
              name: user.name,
              email: user.email,
              admin: user.admin,
              lessons: user.lessons,
            },
          });
        } catch (err: any) {
          req.error = err;
          next();
        }
      }
    }
  );
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await userService.login(email, password);
    const token = await signToken(user);
    res.status(200).json({
      status: 200,
      message: "ورود با موفقیت انجام شد",
      token,
      user: {
        name: user.name,
        email: user.email,
        admin: user.admin,
        lessons: user.lessons,
      },
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.params.email;
  try {
    const user = await userService.findOneByEmail(email);
    emailService.sendForgotPasswordEmail(user.email, (err, info) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: "خطایی رخ داده است",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "لینک تغییر رمز به ایمیل شما ارسال شد",
        });
      }
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body;
  emailService.verifyForgotPassword(token, async (err, info) => {
    if (err) {
      res.status(401).json({
        status: 401,
        message: "لینک تغییر رمز شما نامعتبر است",
      });
    } else {
      try {
        const user = await userService.restPassword(info.email, password);
        res.status(200).json({
          status: 200,
          message: "رمز شما با موفقیت تغییر یافت",
        });
      } catch (err: any) {
        req.error = err;
        next();
      }
    }
  });
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword } = req.body;
  try {
    await userService.changePassword(
      req.user?._id as string,
      oldPassword,
      newPassword
    );
    res.status(200).json({
      status: 200,
      message: "رمز شما با موفقیت تغییر یافت",
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const user = await userService.delete(req.user?._id as string, password);
    await client.del(user._id.toString());
    res.status(200).json({
      status: 200,
      message: "حساب کاربری شما با موفقیت حذف شد",
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const addSavedPractice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const saved = await userService.addSavedPractice(
      req.user?._id as string,
      id
    );
    res.status(200).json({
      status: 200,
      message: "تمرین با موفقیت ذخیره شد",
      data: saved,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};
export const removeSavedPractice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const saved = await userService.removeSavedPractice(
      req.user?._id as string,
      id
    );
    res.status(200).json({
      status: 200,
      message: "تمرین با موفقیت از ذخیره ها حذف شد",
      data: saved,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};
export const getSavedPractices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const saved = await userService.getSavedPractices(req.user?._id as string);
    res.status(200).json({
      status: 200,
      message: "تمرینات ذخیره شده با موفقیت ارسال شد",
      data: saved,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const setLessonToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, lessonsId } = req.body;
    await userService.setLessons(userId, lessonsId);
    await client.del(userId);
    res.status(200).json({
      status: 200,
      message: "درس با موفقیت به کاربر اضافه شد",
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const lessons = await lessonService.getAll();
    const userLessonsOnlyId = (await userService.findOneById(userId)).lessons;
    const userLessonsByTitle = userLessonsOnlyId.map((lesson) => {
      return lessons.find((l) => l._id.toString() === lesson.toString());
    });
    const allLessons = lessons.filter((lesson) => {
      return !userLessonsOnlyId.includes(lesson._id);
    });
    res.status(200).json({
      status: 200,
      message: "درس ها با موفقیت ارسال شدند",
      data: {
        userLessons: userLessonsByTitle,
        allLessons: allLessons,
      },
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({
      status: 200,
      message: "کاربران با موفقیت ارسال شد",
      data: users,
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.findOneById(req.user?._id);
    const token = await signToken(user);
    res.status(200).json({
      status: 200,
      message: "ورود با موفقیت انجام شد",
      token,
      user: {
        name: user.name,
        email: user.email,
        admin: user.admin,
        lessons: user.lessons,
      },
    });
  } catch (err: any) {
    req.error = err;
    next();
  }
};
