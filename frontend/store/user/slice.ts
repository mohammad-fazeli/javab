import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { login, register, addSaved } from "./action";
import { REHYDRATE } from "redux-persist";
import { HYDRATE } from "next-redux-wrapper";

type userType = {
  name: string;
  email: string;
  admin: boolean;
  lessons: string[];
};

type instalState = {
  user: userType | null;
  token: string | null;
  saved: { _id: string; title: string }[];
  pending: boolean;
  error: SerializedError | null;
};

const initialState: instalState = {
  user: null,
  token: null,
  saved: [],
  pending: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setSaved: (state, action) => {
      state.saved = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.pending = false;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.pending = false;
      state.error = action.error;
    });
    builder.addCase(login.pending, (state, action) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.pending = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.pending = false;
    });
    builder.addCase(addSaved.pending, (state, action) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(addSaved.fulfilled, (state, action) => {
      state.pending = false;
      state.error = null;
      state.saved = action.payload.data;
    });
    builder.addCase(addSaved.rejected, (state, action) => {
      state.pending = false;
      state.error = action.error;
    });
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.user) {
        if (state.user) {
          state.user = {
            ...state.user,
            lessons: [...state.user.lessons],
          };
        } else {
          state.user = action.payload.user.user || null;
        }
        state.token = state.token || action.payload.user.token || null;
      }
      return state;
    });
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.user.user) {
        state.user = action.payload.user.user;
      }
      if (action.payload.user.token) {
        state.token = action.payload.user.token;
      }
      return state;
    });
  },
});

export const { logout, setUser, setSaved } = userSlice.actions;

export default userSlice.reducer;
