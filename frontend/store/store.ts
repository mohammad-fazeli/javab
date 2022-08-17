import {
  configureStore,
  combineReducers,
  Action,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import { createWrapper } from "next-redux-wrapper";

import themeSlice from "./theme/slice";
import userSlice from "./user/slice";
import itemsSlice from "./items/slice";
import practiceSlice from "./practice/slice";
import usersSlice from "./users/slice";

const rootReducer = combineReducers({
  theme: themeSlice,
  user: userSlice,
  items: itemsSlice,
  practice: practiceSlice,
  users: usersSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "theme"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: false });
