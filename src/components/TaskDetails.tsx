import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const TaskDetails: React.FC = observer(() => {
  const store = useStore();
  const task = store.activeTask;
  const [title, setTitle] = useState(task?.title ?? "");

  useMemo(() => {
    setTitle(task?.title ?? "");
  }, [task?.id]);

  if (!task) {
    return (
      <div className="no-task">
        <p className="text-center">📝</p>
        <p>Select a task to view/edit its content.</p>
      </div>
    );
  }

  const hasChildren = task.childrenIds.length > 0;
  const parent = task.parentId ? store.tasks.get(task.parentId) : null;
  const creationDate = new Date(task.createDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isRoot = !task.parentId;

  return (
    <div className="task-details">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="flex items-center gap-2">
          <span className="truncate">{task.title}</span>
          {hasChildren ? (
            <CheckCircledIcon className="flex-shrink-0" />
          ) : (
            <ExclamationTriangleIcon className="flex-shrink-0" />
          )}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-secondary">Edit Title</label>
        <input
          className="task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => store.editTask(task.id, { title })}
        />
      </div>

      <div className="details-section">
        <h3>Task Details</h3>
        <p><span className="font-medium">Created:</span> {creationDate}</p>
        <p><span className="font-medium">Type:</span> {isRoot ? "Root Task" : "Branch Task"}</p>
        {parent && (
          <p><span className="font-medium">Parent:</span> <span className="truncate">{parent.title}</span></p>
        )}
        {hasChildren && (
          <div className="mt-2">
            <p className="text-sm font-medium text-text-secondary">
              Branches ({task.childrenIds.length}):
            </p>
            <ul className="max-h-32 overflow-y-auto">
              {task.childrenIds.map((childId) => {
                const child = store.tasks.get(childId);
                return child ? (
                  <li key={childId} className="truncate">{child.title}</li>
                ) : null;
              })}
            </ul>
          </div>
        )}
        {!hasChildren && (
          <p className="text-sm text-text-secondary italic">No branches yet.</p>
        )}
      </div>
    </div>
  );
});