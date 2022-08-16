import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { login, register, addSaved } from "./action";
import { REHYDRATE } from "redux-persist";
import { HYDRATE } from "next-redux-wrapper";

type userType = {
  name: string;
  email: string;
  admin: boolean;
  lessons: string[];
  saved: { _id: string; title: string }[];
};

type instalState = {
  user: userType | null;
  token: string | null;
  pending: boolean;
  error: SerializedError | null;
};

const initialState: instalState = {
  user: null,
  token: null,
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
      state.user = action.payload;
    },
    setSaved: (state, action) => {
      state.user = {
        name: "",
        email: "",
        admin: false,
        lessons: [],
        saved: action.payload,
      };
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
      if (state.user) {
        state.user = {
          ...state.user,
          saved: action.payload.data,
        };
      }
    });
    builder.addCase(addSaved.rejected, (state, action) => {
      state.pending = false;
      state.error = action.error;
    });
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.user.user) {
        state.user = {
          name: action.payload.user?.user?.name,
          email: action.payload.user?.user?.email,
          admin: action.payload.user?.user?.admin,
          lessons: action.payload.user?.user?.lessons,
          saved: state.user?.saved || [],
        };
        state.token = action.payload.user?.token;
      }
      return state;
    });
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.user.user?.saved) {
        state.user = {
          name: state.user?.name || "",
          email: state.user?.email || "",
          admin: state.user?.admin || false,
          lessons: state.user?.lessons || [],
          saved: action.payload.user.user.saved,
        };
      }
      return state;
    });
  },
});

export const { logout, setUser, setSaved } = userSlice.actions;

export default userSlice.reducer;
