import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { fetchLessons } from "./action";
import { HYDRATE } from "next-redux-wrapper";

type usersType = {
  name: string;
  _id: string;
};

type instalState = {
  users: usersType[];
  userLessons: { _id: string; title: string }[];
  allLessons: { _id: string; title: string }[];
  pending: boolean;
  error: SerializedError | null;
};

const initialState: instalState = {
  users: [],
  userLessons: [],
  allLessons: [],
  pending: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    removeLesson: (state, action) => {
      state.userLessons = state.userLessons.filter(
        (lesson) => lesson._id !== action.payload._id
      );
      state.allLessons.push(action.payload);
    },
    addLesson: (state, action) => {
      state.userLessons.push(action.payload);
      state.allLessons = state.allLessons.filter(
        (lesson) => lesson._id !== action.payload._id
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.users) {
        state = action.payload.users;
      }
      return state;
    });
    builder.addCase(fetchLessons.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(fetchLessons.fulfilled, (state, action) => {
      state.pending = false;
      if (action.payload.data) {
        state.userLessons = action.payload.data.userLessons;
        state.allLessons = action.payload.data.allLessons;
      }
    });
    builder.addCase(fetchLessons.rejected, (state, action) => {
      state.pending = false;
      state.error = action.error;
    });
  },
});

export const { addLesson, removeLesson, setUsers } = userSlice.actions;

export default userSlice.reducer;
