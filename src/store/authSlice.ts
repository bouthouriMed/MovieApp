import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Account {
  id: number;
  username: string;
}

export interface AuthState {
  sessionId: string | null;
  accountId: number | null;
  account?: Account | null;
}

const initialState: AuthState = {
  sessionId: localStorage.getItem("tmdbSessionId") || null,
  accountId: localStorage.getItem("tmdbAccountId")
    ? Number(localStorage.getItem("tmdbAccountId"))
    : null,
  account: localStorage.getItem("tmdbAccount")
    ? JSON.parse(localStorage.getItem("tmdbAccount")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ sessionId: string; account: Account }>
    ) => {
      state.sessionId = action.payload.sessionId;
      state.accountId = action.payload.account.id;
      state.account = action.payload.account;

      localStorage.setItem("tmdbSessionId", action.payload.sessionId);
      localStorage.setItem(
        "tmdbAccountId",
        action.payload.account.id.toString()
      );
      localStorage.setItem(
        "tmdbAccount",
        JSON.stringify(action.payload.account)
      );
    },
    logout: (state) => {
      state.sessionId = null;
      state.accountId = null;
      state.account = null;

      localStorage.removeItem("tmdbSessionId");
      localStorage.removeItem("tmdbAccountId");
      localStorage.removeItem("tmdbAccount");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
