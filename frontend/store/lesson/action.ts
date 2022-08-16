import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export const addLesson = createAsyncThunk(
  "items/",
  async (name: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lesson`,
        {
          title: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateLesson = createAsyncThunk(
  "items/",
  async ({ _id, title }: { _id: string; title: string }, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lesson/${_id}`,
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "items/",
  async (_id: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).user.token;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lesson/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
