import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
