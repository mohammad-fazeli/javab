import { Response, NextFunction } from "express";
import { Request } from "../types/request";
import jwt from "jsonwebtoken";
import { UserDocument } from "../model/user.model";
import { client } from "../db";

export const signToken = async (
  user: UserDocument,
  expiresIn: string = "32h"
) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn,
    }
  );
  await client.set(
    user._id.toString(),
    JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    }),
    {
      EX: 60 * 60 * 24,
      NX: true,
    }
  );
  return token;
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
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
    async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: "token is not valid",
        });
      }
      const user = await client.get(decoded._id);
      if (!user) {
        return res.status(403).json({
          status: 403,
          message: "token is not valid",
        });
      }
      req.user = JSON.parse(user);
      next();
    }
  );
};

export const isAuthRefresh = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    async (err: any, decoded: any) => {
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

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.admin) {
    return res.status(401).json({
      status: 401,
      message: "شما اجازه دسترسی به این بخش را ندارید",
    });
  }
  next();
};
