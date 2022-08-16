import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  Mode: "light" | "dark" | "auto";
  darkMode: boolean;
};

const initialState: InitialState = {
  Mode: "auto",
  darkMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action: { payload: InitialState["Mode"] }) => {
      state.Mode = action.payload;
      if (action.payload === "dark") {
        state.darkMode = true;
      } else if (action.payload === "light") {
        state.darkMode = false;
      }
    },
    setDarkMode: (state, action: { payload: boolean }) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
