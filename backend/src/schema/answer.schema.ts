import { object, string } from "yup";

export const addAnswerSchema = object({
  body: object({
    practice_id: string().required("شناسه درس ضروری است"),
  }),
});
