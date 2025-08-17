import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import { TaskNode } from "./TaskNode";

export const TaskTree: React.FC = observer(() => {
  const store = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim()) {
      store.addTask({ title: newTaskTitle });
      setNewTaskTitle("");
    }
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ("key" in e && e.key !== "Enter") return;
    addTask();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="control-btns task-tree">
        <div className="left-section">
          <input
            className="task-add-input"
            placeholder="Add root task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleAddTask}
          />
          <button 
            className="task-button add-root"
            onClick={handleAddTask}
            disabled={!newTaskTitle.length}
          >
            Add
          </button>
        </div>
        <div className="right-section">
          <button className="task-button" onClick={store.expandAll}>
            <span className="hidden sm:inline">Expand All</span>
          </button>
          <button className="task-button" onClick={store.collapseAll}>
            <span className="hidden sm:inline">Collapse All</span>
          </button>
        </div>
      </div>

      <div className="node-container">
        {store.filteredRootIds.map((id) => (
          <TaskNode key={id} id={id} />
        ))}
        {store.filteredRootIds.length === 0 && (
          <div className="text-gray-500 text-sm py-4 text-center">
            No tasks yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
});