import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { handleError } from "../../utils/handleError";
import { setPercent } from "../practice/slice";

export const addAnswer = createAsyncThunk(
  "answer/",
  async (answer: any, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer`,
        answer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress(progressEvent) {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            ThunkAPI.dispatch(setPercent(percent));
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const editAnswer = createAsyncThunk(
  "answer/",
  async (
    { answer, answer_id }: { answer: any; answer_id: string },
    ThunkAPI
  ) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer/${answer_id}`,
        answer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress(progressEvent) {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            ThunkAPI.dispatch(setPercent(percent));
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const deleteAnswer = createAsyncThunk(
  "answer/",
  async (answer_id: any, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer/${answer_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const decreaseRate = createAsyncThunk(
  "answer/rate",
  async (answer_id: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer/rate/decrease/${answer_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const increaseRate = createAsyncThunk(
  "answer/rate",
  async (answer_id: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer/rate/increase/${answer_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);

export const addComment = createAsyncThunk(
  "answer/",
  async (
    comment: { content: string; answer_id?: string; parent?: string },
    ThunkAPI
  ) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment`,
        {
          ...comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);

export const editComment = createAsyncThunk(
  "answer/",
  async (comment: { content: string; comment_id: string }, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/${comment.comment_id}`,
        {
          content: comment.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "answer/",
  async (comment_id: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/${comment_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
