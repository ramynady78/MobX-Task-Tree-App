import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";

export const ThemeToggle: React.FC = observer(() => {
  const store = useStore();
  return (
    <div className="theme-toggle">
      <select
        value={store.theme}
        onChange={(e) => store.setTheme(e.target.value as any)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
});