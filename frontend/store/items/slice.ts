import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { addLesson } from "../lesson/action";

type initialState = {
  title: string | null;
  items: { _id: string; title: string }[];
  pending: boolean;
  error: SerializedError | null;
};

const initialState: initialState = {
  title: "",
  items: [],
  pending: false,
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
    });
    builder.addCase(addLesson.rejected, (state, action: any) => {
      state.pending = false;
      state.error = action.error;
    });
  },
});
export const { setState } = itemSlice.actions;
export default itemSlice.reducer;
