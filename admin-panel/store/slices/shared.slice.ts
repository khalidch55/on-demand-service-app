import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SharedState {
  /** In-flight HTTP requests tracked by axios. Loader shows when this count is positive. */
  pendingRequests: number;
  /** Full-screen loader for non-axios work (or forced UX). */
  manualLoader: boolean;
  token: string | null;
  user: Record<string, any> | null;
}

const initialState: SharedState = {
  pendingRequests: 0,
  manualLoader: false,
  token: null,
  user: null,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    beginApiRequest(state) {
      state.pendingRequests += 1;
    },
    endApiRequest(state) {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.manualLoader = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<Record<string, any> | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.pendingRequests = 0;
      state.manualLoader = false;
    },
  },
});

export const sharedActions = sharedSlice.actions;
export default sharedSlice.reducer;
