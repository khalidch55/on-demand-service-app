"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  id: number;
  role?: string;
  iat: number;
  exp: number;
}

export interface UserState {
  loggedIn: boolean;
  email?: string;
  id?: number;
  role?: string;
  token?: string;
}

const initialState: UserState = {
  loggedIn: false,
  email: undefined,
  id: undefined,
  role: undefined,
  token: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeUser(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode<DecodedToken>(token);
            state.loggedIn = true;
            state.email = decoded.email;
            state.id = decoded.id;
            state.role = decoded.role;
            state.token = token;
          } catch (error) {
            console.error("Error decoding token on initialization:", error);
            localStorage.removeItem("token");
            state.loggedIn = false;
            state.email = undefined;
            state.id = undefined;
            state.role = undefined;
            state.token = undefined;
          }
        }
      }
    },
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      const { token } = action.payload;
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        state.loggedIn = true;
        state.email = decoded.email;
        state.id = decoded.id;
        state.role = decoded.role;
        state.token = token;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      } catch (error) {
        console.error("Error decoding token on login:", error);
      }
    },
    logout(state) {
      state.loggedIn = false;
      state.email = undefined;
      state.id = undefined;
      state.role = undefined;
      state.token = undefined;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { initializeUser, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
