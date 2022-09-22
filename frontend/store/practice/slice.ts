import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { addAnswer, increaseRate } from "../answer/action";
import { updatePractice } from "./action";

export type practice = {
  _id: string;
  lesson: string;
  title: string;
  question: string;
  file: string;
  description: string;
  views: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type commentType = {
  _id: string;
  content: string;
  parent?: string;
  replayTo?: string;
  createdBy: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type answer = {
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  practice_id: string;
  file?: string;
  description?: string;
  rate: number;
  comments: commentType[];
};
type practiceStateType = {
  practice: practice;
  answers: answer[];
  pending: boolean;
  uploadPercent: number;
  error: SerializedError | null;
};

const initialState: practiceStateType = {
  practice: {
    _id: "",
    lesson: "",
    title: "",
    question: "",
    file: "",
    description: "",
    views: 0,
    createdBy: "",
    createdAt: "",
    updatedAt: "",
  },
  answers: [],
  pending: false,
  uploadPercent: 0,
  error: null,
};

const PracticeSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    setState: (state, action) => {
      state.practice = action.payload.practice;
      state.answers = action.payload.answers;
    },
    setPercent: (state, action) => {
      state.uploadPercent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.practice) {
        state = action.payload.practice;
      }
      return state;
    });
    builder.addCase(updatePractice.pending, (state: practiceStateType) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(updatePractice.fulfilled, (state: practiceStateType) => {
      state.pending = false;
      state.uploadPercent = 0;
    });
    builder.addCase(updatePractice.rejected, (state: practiceStateType) => {
      state.pending = false;
      state.uploadPercent = 0;
    });
    builder.addCase(addAnswer.pending, (state: practiceStateType) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(addAnswer.fulfilled, (state: practiceStateType, action) => {
      state.pending = false;
      state.answers = action.payload.data;
      state.uploadPercent = 0;
    });
    builder.addCase(addAnswer.rejected, (state: practiceStateType, action) => {
      state.pending = false;
      state.error = action.error;
      state.uploadPercent = 0;
    });
    builder.addCase(increaseRate.pending, (state: practiceStateType) => {
      state.error = null;
    });
    builder.addCase(
      increaseRate.fulfilled,
      (state: practiceStateType, action) => {
        state.answers = action.payload.data;
      }
    );
    builder.addCase(
      increaseRate.rejected,
      (state: practiceStateType, action) => {
        state.error = action.error;
      }
    );
  },
});
export const { setState, setPercent } = PracticeSlice.actions;
export default PracticeSlice.reducer;
