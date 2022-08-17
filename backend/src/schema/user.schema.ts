import { object, string, array } from "yup";

export const registerUserSchema = object({
  body: object({
    name: string()
      .required("لطفا نام را وارد کنید")
      .min(3, "نام باید حداقل 3 کاراکتر باشد")
      .max(25, "نام باید حداکثر 25 کاراکتر باشد"),
    email: string()
      .email("ایمیل معتبر نیست")
      .required("لطفا ایمیل را وارد کنید"),
    password: string()
      .required("لطفا رمز عبور را وارد کنید")
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
      .max(20, "رمز عبور باید حداکثر 20 کاراکتر باشد"),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string()
      .email("ایمیل معتبر نیست")
      .required("لطفا ایمیل را وارد کنید"),
    password: string().required("لطفا رمز عبور را وارد کنید"),
  }),
});

export const restPasswordSchema = object({
  body: object({
    password: string()
      .required("لطفا رمز عبور را وارد کنید")
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
      .max(20, "رمز عبور باید حداکثر 20 کاراکتر باشد"),
    token: string().required("لطفا توکن را وارد کنید"),
  }),
});

export const changePasswordSchema = object({
  body: object({
    newPassword: string()
      .required("لطفا رمز عبور را وارد کنید")
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
      .max(20, "رمز عبور باید حداکثر 20 کاراکتر باشد"),
    oldPassword: string().required("لطفا رمز عبور قدیم را وارد کنید"),
  }),
});

export const deleteAccountSchema = object({
  body: object({
    password: string().required("لطفا رمز عبور را وارد کنید"),
  }),
});

export const setLessonSchema = object({
  body: object({
    lessonsId: array().required("لطفا دروس را وارد کنید"),
    userId: string().required("لطفا id کاربر را وارد کنید"),
  }),
});
