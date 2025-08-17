export type ThemeMode = "light" | "dark" | "system";

export interface Task {
  id: string;
  title: string;
  parentId: string | null;
  childrenIds: string[]; 
  createDate: Date;
}


export interface SerializedStore {
  tasks: Record<string, Task>;
  rootIds: string[];
  expandedIds: string[];
  selectedIds: string[];
  searchQuery: string;
  theme: ThemeMode;
  activeTaskId: string | null;
  version: number;
}