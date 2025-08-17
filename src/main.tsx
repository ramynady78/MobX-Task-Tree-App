import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { StoreProvider } from "./store/StoreProvider";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
    <BrowserRouter basename="/MobX-Task-Tree-App">
       <App />
    </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
);
