import { Request as req } from "express";
export interface Request extends req {
  user?: {
    _id: string;
    name: string;
    email: string;
    admin: boolean;
  };
  error?: any;
}
