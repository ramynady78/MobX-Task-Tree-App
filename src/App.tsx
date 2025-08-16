import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { TaskTree } from "./components/TaskTree";
import { TaskDetails } from "./components/TaskDetails";
import { ThemeToggle } from "./components/ThemeToggle";
import { useStore } from "./store/StoreProvider";

export const App: React.FC = observer(() => {
  const store = useStore();

  // Handle theme switching
  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const wantDark = store.theme === 'dark' || (store.theme === 'system' && systemDark);
    root.classList.toggle('dark', wantDark);
  }, [store.theme]);

  return (
    <div className="app-container min-h-screen grid grid-cols-12 gap-4">
      <header className="header col-span-12 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task Tree</h1>
        <ThemeToggle />
      </header>
      <div className="container">
        <aside className="aside col-span-5 overflow-auto">
        <TaskTree />
        </aside>
        <main className="main col-span-7">
          <TaskDetails />
        </main>
      </div>
    </div>
  );
});