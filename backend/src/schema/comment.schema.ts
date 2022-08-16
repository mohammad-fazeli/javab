import { object, string } from "yup";

export const addCommentSchema = object({
  body: object({
    content: string().required("نظر باید وارد شود"),
  }),
});
