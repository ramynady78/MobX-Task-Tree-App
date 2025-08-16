import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";

export const TaskDetails: React.FC = observer(() => {
  const store = useStore();
  const task = store.activeTask;
  const [title, setTitle] = useState(task?.title ?? "");

  useMemo(() => {
    setTitle(task?.title ?? "");
  }, [task?.id]);

  if (!task) {
    return <div className="text-gray-500">Select a task to view/edit its content.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        className="task-input text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => store.editTask(task.id, { title })}
      />
    </div>
  );
});