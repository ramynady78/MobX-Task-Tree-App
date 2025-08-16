import React, { createContext, useContext } from "react";
import { taskStore, TaskStore } from "./TaskStore";

const StoreContext = createContext<TaskStore>(taskStore);
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreContext.Provider value={taskStore}>{children}</StoreContext.Provider>
);
export const useStore = () => useContext(StoreContext);