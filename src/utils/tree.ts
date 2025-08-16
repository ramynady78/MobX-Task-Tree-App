import type { Task } from "../types/task";


// get all childerns -- use depth  first search 
export function getDescendants(taskMap: Map<string, Task>, id: string): string[] {
  const out: string[] = [];
  const stack = [...(taskMap.get(id)?.childrenIds ?? [])];
  while (stack.length) {
    const cur = stack.pop()!;
    out.push(cur);
    const node = taskMap.get(cur);
    if (node) stack.push(...node.childrenIds);
  }
  return out;
};



export function getAncestors(taskMap: Map<string, Task>, id: string): string[] {
  const out: string[] = [];
  let cur: Task | undefined = taskMap.get(id);
  while (cur && cur.parentId) {
    out.push(cur.parentId);
    cur = taskMap.get(cur.parentId);
  }
  return out;
}

export function removeFromArray<T>(arr: T[], item: T) {
  const idx = arr.indexOf(item);
  if (idx >= 0) arr.splice(idx, 1);
}
