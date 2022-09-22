import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { addLesson } from "../lesson/action";

type initialState = {
  title: string | null;
  items: { _id: string; title: string }[];
  pending: boolean;
  uploadPercent: number;

  error: SerializedError | null;
};

const initialState: initialState = {
  title: "",
  items: [],
  pending: false,
  uploadPercent: 0,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setState: (state, action) => {
      state.title = action.payload.title;
      state.items = action.payload.items;
    },
    setPercent: (state, action) => {
      state.uploadPercent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.items) {
        state = action.payload.items;
      }
      return state;
    });
    builder.addCase(addLesson.pending, (state, action: any) => {
      state.pending = true;
    });
    builder.addCase(addLesson.fulfilled, (state, action: any) => {
      state.pending = false;
      state.items = action.payload.data;
      state.uploadPercent = 0;
    });
    builder.addCase(addLesson.rejected, (state, action: any) => {
      state.pending = false;
      state.error = action.error;
      state.uploadPercent = 0;
    });
  },
});
export const { setState, setPercent } = itemSlice.actions;
export default itemSlice.reducer;
