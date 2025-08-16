import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import { TaskNode } from "./TaskNode";

export const TaskTree: React.FC = observer(() => {
  const store = useStore();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center control-btns">
        <input
          className="task-input flex-1"
          placeholder="Search tasks..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
        />
        <button className="task-button" onClick={() => store.addTask({})}>
          + Root
        </button>
        <button className="task-button" onClick={store.expandAll}>
          Expand all
        </button>
        <button className="task-button" onClick={store.collapseAll}>
          Collapse all
        </button>
      </div>

      <div className="flex flex-col">
        {store.filteredRootIds.map((id) => (
          <TaskNode key={id} id={id} />
        ))}
        {store.filteredRootIds.length === 0 && (
          <div className="text-gray-500 text-sm py-4">No tasks yet. Add one!</div>
        )}
      </div>
    </div>
  );
});