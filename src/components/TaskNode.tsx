import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreProvider";
import type { Task } from "../types/task";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Props { id: string; depth?: number; }

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

  return (
    <div className="task-node flex flex-col gap-1" style={{ paddingLeft: depth * 16 , marginTop: "1rem" , padding: ".5rem"}}>
      <div className="flex items-center gap-2 node-task">

        <div className="node-info"
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
        }}>
          {hasChildren ? (
          <button
            className="expand-collapse toggle-btn"
            onClick={() => store.toggleExpand(id)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDownIcon/> 
            : <ChevronRightIcon/>}
          </button>
        ) : (
          <span className="w-4 inline-block" />
        )}

       

        <button
          className="task-title"
          onClick={() => store.setActiveTask(id)}
        >
          {node.title}
        </button>

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
          
        <div className="flex items-center gap-1">
          <button className="task-button" onClick={() => store.addSubtask(id)}>
            + Sub
          </button>
          <button className="task-button" onClick={() => store.deleteTask(id)}>
            Delete
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