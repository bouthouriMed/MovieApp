// src/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  sessionId: string | null;
  accountId: number | null;
}

const initialState: AuthState = {
  sessionId: localStorage.getItem("tmdbSessionId") || null,
  accountId: localStorage.getItem("tmdbAccountId")
    ? Number(localStorage.getItem("tmdbAccountId"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ sessionId: string; accountId: number }>
    ) => {
      state.sessionId = action.payload.sessionId;
      state.accountId = action.payload.accountId;

      localStorage.setItem("tmdbSessionId", action.payload.sessionId);
      localStorage.setItem(
        "tmdbAccountId",
        action.payload.accountId.toString()
      );
    },
    logout: (state) => {
      state.sessionId = null;
      state.accountId = null;

      localStorage.removeItem("tmdbSessionId");
      localStorage.removeItem("tmdbAccountId");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
