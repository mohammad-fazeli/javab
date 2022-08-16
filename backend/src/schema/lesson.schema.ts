import { object, string } from "yup";

export const LessonSchema = object({
  body: object({
    title: string().required("نام درس را وارد کنید"),
  }),
});
