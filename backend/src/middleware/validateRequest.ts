import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      res.status(400).json({
        status: 400,
        errors: err.errors,
      });
    }
  };

export default validateRequest;
