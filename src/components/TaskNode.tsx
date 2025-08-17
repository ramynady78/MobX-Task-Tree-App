import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Props { 
  id: string; 
  depth?: number; 
}

export const TaskNode: React.FC<Props> = observer(({ id, depth = 0 }) => {
  const store = useStore();
  const node = store.tasks.get(id);
  if (!node) return null;
  const visible = store.isVisibleInSearch(id);
  if (!visible) return null;

  const hasChildren = node.childrenIds.length > 0;
  const expanded = store.isExpanded(id);
  const isSelected = store.isSelected(id);
  const isIndeterminate = store.isIndeterminate(id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [subTaskTitle, setSubTaskTitle] = useState("");

  useEffect(() => {
    setTitle(node.title);
  }, [node.title]);

  const handleTitleClick = () => {
    setIsEditing(true);
    store.setActiveTask(id);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (title.trim() === "") {
      setTitle(node.title);
    } else if (title !== node.title) {
      store.editTask(id, { title });
    }
  };

  const handleAddSubTask = () => {
    if (subTaskTitle.trim()) {
      store.addSubtask(id, { title: subTaskTitle });
      setSubTaskTitle("");
    } else {
      store.addSubtask(id);
    }
  };

  const handleSubKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddSubTask();
    }
  };

  // Limit depth indentation on mobile
  const adjustedDepth = window.innerWidth <= 768 ? Math.min(depth, 2) : depth;

  return (
    <div 
      className="task-node" 
      style={{ paddingLeft: `${adjustedDepth * (window.innerWidth <= 768 ? 15 : 20)}px`}}
    >
      <div className="node-task">
        <div className="node-info">
          {hasChildren ? (
            <button
              className="toggle-btn"
              onClick={() => store.toggleExpand(id)}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
          ) : (
            <span className="w-4 inline-block" />
          )}

          {isEditing ? (
            <input
              className="inline-edit"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
              autoFocus
            />
          ) : (
            <button
              className="task-title"
              onClick={handleTitleClick}
            >
              {node.title}
            </button>
          )}

          <Checkbox.Root
            className="task-checkbox"
            checked={isSelected}
            onCheckedChange={() => store.toggleSelect(id)}
            ref={(el) => {
              if (el) {
                const input = el.querySelector('input');
                if (input) input.indeterminate = isIndeterminate;
              }
            }}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>

        <div className="control-btns">
          <div className="sub-add-container">
            <input
              className="task-add-input sub-task-input"
              placeholder={window.innerWidth <= 480 ? "Add..." : "Add Branch..."}
              value={subTaskTitle}
              onChange={(e) => setSubTaskTitle(e.target.value)}
              onKeyDown={handleSubKeyDown}
            />
            <button 
              className="add-icon-btn"
              onClick={handleAddSubTask}
              disabled={!subTaskTitle.length}
            >
              Add
            </button>
          </div>
          <button 
            className="task-button delete" 
            onClick={() => store.deleteTask(id)}
          >
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="flex flex-col">
          {node.childrenIds.map((cid) => (
            <TaskNode key={cid} id={cid} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
});