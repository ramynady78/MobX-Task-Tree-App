import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import { TaskNode } from "./TaskNode";

export const TaskTree: React.FC= observer(() => {
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
        <div className="flex gap-2 items-center control-btns">
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
          >add</button>
          </div>
          <div className="right-section">
            <button className="task-button" onClick={store.expandAll}>
              Expand all
            </button>
            <button className="task-button" onClick={store.collapseAll}>
              Collapse all
            </button>
          </div>
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