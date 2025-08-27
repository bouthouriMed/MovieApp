import React, { ReactNode } from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore, Reducer } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer, { AuthState } from "./store/authSlice";
import watchListReducer, { WatchListState } from "./store/watchListSlice";
import { moviesApi } from "./store/movieSlice";

// --- Helper for renderHook with optional store ---
import {
  renderHook as rtlRenderHook,
  RenderHookOptions,
} from "@testing-library/react";
import { userApi } from "./store/userSlice";

// Explicit reducers type
export const reducers: {
  auth: Reducer<AuthState>;
  watchList: Reducer<WatchListState>;
  [moviesApi.reducerPath]: typeof moviesApi.reducer;
  [userApi.reducerPath]: typeof userApi.reducer;
} = {
  auth: authReducer,
  watchList: watchListReducer,
  [moviesApi.reducerPath]: moviesApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

// Test helper
export const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(moviesApi.middleware)
        .concat(userApi.middleware),
    preloadedState,
  });

// --- DOM mocks for scrollable elements ---
export const setupDOMMocks = () => {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth"
  );
  const originalScrollWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "scrollWidth"
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      value: 500,
    });
  });

  afterAll(() => {
    if (originalOffsetWidth)
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetWidth",
        originalOffsetWidth
      );
    if (originalScrollWidth)
      Object.defineProperty(
        HTMLElement.prototype,
        "scrollWidth",
        originalScrollWidth
      );
  });
};

// --- Unified render for components ---
interface RenderOptions {
  store?: ReturnType<typeof createTestStore>;
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

export const render = (
  ui: React.ReactNode,
  { store, ...renderOptions }: RenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (store) {
      return (
        <Provider store={store}>
          <MemoryRouter>{children}</MemoryRouter>
        </Provider>
      );
    }
    return <MemoryRouter>{children}</MemoryRouter>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export const renderHookWithStore = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  {
    store,
    wrapper,
    ...options
  }: RenderHookOptions<TProps> & {
    store?: ReturnType<typeof createTestStore>;
  } = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (wrapper) return React.createElement(wrapper, null, children);
    return store ? (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    ) : (
      <MemoryRouter>{children}</MemoryRouter> // always wrap in Router
    );
  };
  return rtlRenderHook(hook, { wrapper: Wrapper, ...options });
};

export const renderWithoutRouter = (
  ui: React.ReactNode,
  { store, ...renderOptions }: RenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return store ? (
      <Provider store={store}>{children}</Provider>
    ) : (
      <>{children}</>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
