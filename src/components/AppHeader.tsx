import { observer } from "mobx-react-lite";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "src/store/StoreProvider";

export const AppHeader: React.FC = observer(() => {
    const store = useStore();
    
  return (
    <div className="header">
      <h1 className="text-2xl md:text-2xl font-semibold">Task Tree</h1>
      <div className="search-and-theme">
        <input
        className="task-input search"
        placeholder="Search tasks..."
        value={store.searchQuery}
        onChange={(e) => store.setSearchQuery(e.target.value)}
      />
      <ThemeToggle />
      </div>
    </div>
  );
});