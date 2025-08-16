import { observer } from "mobx-react-lite";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "src/store/StoreProvider";

export const AppHeader: React.FC = observer(() => {
    const store = useStore();
    
  return (
    <div className="header flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-100">
    
      <h1 className="text-2xl font-semibold">Task Tree</h1>
      <input
        className="task-input search md:w-1/3"
        placeholder="Search tasks..."
        value={store.searchQuery}
        onChange={(e) => store.setSearchQuery(e.target.value)}
      />
      <ThemeToggle />
    </div>
  );
});
