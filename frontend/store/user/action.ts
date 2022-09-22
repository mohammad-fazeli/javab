import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { handleError } from "../../utils/handleError";

export const register = createAsyncThunk(
  "User/",
  async (user: { name: string; email: string; password: string }, ThunkAPI) => {
    try {
      const body = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`,
        body
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const verify = createAsyncThunk(
  "User/login",
  async (token: string, ThunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/${token}`
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const login = createAsyncThunk(
  "User/login",
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    try {
      const body = {
        email,
        password,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        body
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const refresh = createAsyncThunk("User/login", async (arg, ThunkAPI) => {
  try {
    const token = (ThunkAPI.getState() as RootState).user.token;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh`,
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
});
export const forgotPassword = createAsyncThunk(
  "User/",
  async (email: string, ThunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/forgot-password/${email}`
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "User/",
  async (
    { token, password }: { token: string; password: string },
    ThunkAPI
  ) => {
    try {
      const body = {
        password: password,
        token: token,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/reset-password`,
        body
      );
      return response.data;
    } catch (error: any) {
      return handleError(error, ThunkAPI);
    }
  }
);
export const changePassword = createAsyncThunk(
  "User/",
  async (
    {
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    },
    ThunkAPI
  ) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/change-password`,
        {
          oldPassword,
          newPassword,
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
export const deleteAccount = createAsyncThunk(
  "User/deleteAccount",
  async (password: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState).user.token;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/delete-account`,
        {
          password,
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
export const addSaved = createAsyncThunk(
  "User/saved",
  async (practice_id: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState as RootState).user.token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/saved/${practice_id}`,
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
export const removeSaved = createAsyncThunk(
  "User/saved",
  async (practice_id: string, ThunkAPI) => {
    try {
      const token = (ThunkAPI.getState() as RootState as RootState).user.token;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/saved/${practice_id}`,
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
