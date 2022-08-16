import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument } from "../model/user.model";

export const signToken = (user: UserDocument, expiresIn: string = "24h") =>
  jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn,
    }
  );

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: "token is not provided",
    });
  }
  jwt.verify(
    authorization.replace("Bearer ", ""),
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: "token is not valid",
        });
      }
      req.user = decoded;
      next();
    }
  );
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user.admin) {
    return res.status(401).json({
      status: 401,
      message: "شما اجازه دسترسی به این بخش را ندارید",
    });
  }
  next();
};
