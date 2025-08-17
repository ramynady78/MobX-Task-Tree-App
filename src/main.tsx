import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { StoreProvider } from "./store/StoreProvider";
import {  HashRouter } from "react-router-dom";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>
);
