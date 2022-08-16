import { Request, Response } from "express";
import userService from "../services/user.service";
import emailService from "../services/email.service";
import { signToken } from "../utils/auth";

export const signup = async (req: Request, res: Response) => {
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
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const verify = async (req: Request, res: Response) => {
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
          const token = signToken(user);
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
          if (err.code === 404) {
            return res.status(404).json({
              status: 404,
              message: "کاربری یافت نشد",
            });
          }
          if (err.code === 400) {
            return res.status(400).json({
              status: 400,
              message: "حساب کاربری شما قبلا تایید شده است",
            });
          }
          res.status(500).json({
            status: 500,
            message: "خطایی رخ داده است",
          });
        }
      }
    }
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userService.login(email, password);
    const token = signToken(user);
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
    if (err.code === 401) {
      return res.status(401).json({
        status: 401,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
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
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "کاربری با این ایمیل یافت نشد",
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
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
        if (err.code === 404) {
          return res.status(404).json({
            status: 404,
            message: "کاربری با این ایمیل یافت نشد",
          });
        }
        res.status(500).json({
          status: 500,
          message: "خطایی رخ داده است",
        });
      }
    }
  });
};

export const changePassword = async (req: any, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    res.status(200).json({
      status: 200,
      message: "رمز شما با موفقیت تغییر یافت",
    });
  } catch (err: any) {
    if (err.code === 401) {
      return res.status(401).json({
        status: 401,
        message: "رمز عبور قدیمی شما اشتباه است",
      });
    }
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: "کاربری با این ایمیل یافت نشد",
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  try {
    const { password } = req.body;
    await userService.delete(req.user._id, password);
    res.status(200).json({
      status: 200,
      message: "حساب کاربری شما با موفقیت حذف شد",
    });
  } catch (err: any) {
    if (err.code === 404 || err.code === 401) {
      return res.status(err.code).json({
        status: err.code,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const addSavedPractice = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const saved = await userService.addSavedPractice(req.user._id, id);
    res.status(200).json({
      status: 200,
      message: "تمرین با موفقیت ذخیره شد",
      data: saved,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};
export const removeSavedPractice = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const saved = await userService.removeSavedPractice(req.user._id, id);
    res.status(200).json({
      status: 200,
      message: "تمرین با موفقیت از ذخیره ها حذف شد",
      data: saved,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};
export const getSavedPractices = async (req: any, res: Response) => {
  try {
    const saved = await userService.getSavedPractices(req.user._id);
    res.status(200).json({
      status: 200,
      message: "تمرینات ذخیره شده با موفقیت ارسال شد",
      data: saved,
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const addLessonToUser = async (req: any, res: Response) => {
  try {
    const { userId, lessonId } = req.body;
    await userService.addLessonToUser(userId, lessonId);
    res.status(200).json({
      status: 200,
      message: "درس با موفقیت به کاربر اضافه شد",
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};

export const removeLessonFromUser = async (req: any, res: Response) => {
  try {
    const { userId, lessonId } = req.body;
    await userService.removeLessonFromUser(userId, lessonId);
    res.status(200).json({
      status: 200,
      message: "درس با موفقیت از کاربر حذف شد",
    });
  } catch (err: any) {
    if (err.code === 404) {
      return res.status(404).json({
        status: 404,
        message: err.message,
      });
    }
    res.status(500).json({
      status: 500,
      message: "خطایی رخ داده است",
    });
  }
};
