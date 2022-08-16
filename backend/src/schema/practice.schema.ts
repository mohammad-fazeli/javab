import { object, string } from "yup";

export const createPracticeSchema = object({
  body: object({
    lesson: string().required("درس مورد نظر را وارد کنید"),
    title: string().required("عنوان را وارد کنید"),
    question: string().required("سوال را وارد کنید"),
  }),
});
