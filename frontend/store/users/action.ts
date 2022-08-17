import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export const fetchLessons = createAsyncThunk(
  "users/",

  async (userId: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/lessons/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const setLessons = createAsyncThunk(
  "users/",
  async (data: { userId: string; lessonsId: string[] }, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/set-lesson`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return ThunkAPI.rejectWithValue(err.response.data);
    }
  }
);
