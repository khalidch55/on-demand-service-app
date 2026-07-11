import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import sharedReducer from "./slices/shared.slice";
import authReducer from "./slices/auth.slice";

export const store = configureStore({
  reducer: {
    shared: sharedReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — use these throughout the app instead of plain `useDispatch` / `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
