import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { handleError } from "../utils/handleError";

export const addPractices = createAsyncThunk(
  "items/",
  async (practice: any, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/practice`,
        practice,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, thunkAPI);
    }
  }
);
export const updateTitlePractice = createAsyncThunk(
  "items/",
  async ({ _id, title }: { _id: string; title: string }, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/practice/${_id}`,
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, thunkAPI);
    }
  }
);
export const updatePractice = createAsyncThunk(
  "practice/",
  async (practice: FormData, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/practice/${practice.get(
          "_id"
        )}`,
        practice,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, thunkAPI);
    }
  }
);
export const deletePractice = createAsyncThunk(
  "items/",
  async (_id: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/practice/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, thunkAPI);
    }
  }
);
