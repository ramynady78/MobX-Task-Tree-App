import { makeAutoObservable, toJS, reaction } from "mobx";
import type { Task, ThemeMode, SerializedStore } from "../types/task";
import { uid } from "../utils/id";
import { getAncestors, getDescendants, removeFromArray } from "../utils/tree";

const LS_KEY = "mobx-task-tree@v1";

export class TaskStore {
  tasks = new Map<string, Task>();
  rootIds: string[] = [];
  expandedIds = new Set<string>();
  selectedIds = new Set<string>();
  searchQuery = "";
  theme: ThemeMode = "system";
  activeTaskId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.hydrate();
    // persist on any relevant change
    reaction(
      () => this.serialize(),
      (data) => localStorage.setItem(LS_KEY, JSON.stringify(data))
    );
  }

  // ------------- CRUD -------------
  addTask(partial: { title?: string;  parentId?: string | null } = {}) {
    const id = uid();
    const parentId = partial.parentId ?? null;
    const task: Task = {
      id,
      title: partial.title?.trim() || "New Task",
      parentId,
      childrenIds: [],
    };
    this.tasks.set(id, task);

    if (parentId) {
      const parent = this.tasks.get(parentId);
      if (parent) parent.childrenIds.push(id);
      this.expandedIds.add(parentId); // auto-expand parent when adding child
    } else {
      this.rootIds.push(id);
    }
    this.activeTaskId = id;
    return id;
  }

  addSubtask(parentId: string, partial?: { title?: string;}) {
    return this.addTask({ parentId, ...partial });
  }

  editTask(id: string, patch: Partial<Pick<Task, "title">>) {
    const t = this.tasks.get(id);
    if (!t) return;
    if (patch.title !== undefined) t.title = patch.title;
  }

  deleteTask(id: string) {
    const task = this.tasks.get(id);
    if (!task) return;

    // delete subtree
    const toDelete = [id, ...getDescendants(this.tasks, id)];
    for (const delId of toDelete) {
      this.tasks.delete(delId);
      this.expandedIds.delete(delId);
      this.selectedIds.delete(delId);
      if (this.activeTaskId === delId) this.activeTaskId = null;
    }

    if (task.parentId) {
      const parent = this.tasks.get(task.parentId);
      if (parent) removeFromArray(parent.childrenIds, id);
    } else {
      removeFromArray(this.rootIds, id);
    }
  }

  // ------------- Selection (checkbox) -------------
  toggleSelect(id: string) {
    const isSelected = this.selectedIds.has(id);
    const ids = [id, ...getDescendants(this.tasks, id)];
    if (isSelected) {
      // deselect self and all descendants
      ids.forEach((i) => this.selectedIds.delete(i));
    } else {
      // select self and all descendants
      ids.forEach((i) => this.selectedIds.add(i));
    }
    // update ancestors: if all children selected -> select parent; else deselect parent
    for (const anc of getAncestors(this.tasks, id)) {
      const node = this.tasks.get(anc);
      if (!node) continue;
      const allChildrenSelected = node.childrenIds.every((cid) => this.selectedIds.has(cid));
      if (allChildrenSelected) this.selectedIds.add(anc);
      else this.selectedIds.delete(anc);
    }
  }

  isSelected(id: string) {
    return this.selectedIds.has(id);
  }

  isIndeterminate(id: string) {
    const node = this.tasks.get(id);
    if (!node || node.childrenIds.length === 0) return false;
    const selChildren = node.childrenIds.filter((cid) => this.selectedIds.has(cid)).length;
    return selChildren > 0 && selChildren < node.childrenIds.length;
  }

  clearSelection() {
    this.selectedIds.clear();
  }

  // ------------- Expand/Collapse -------------
  toggleExpand(id: string) {
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  }

  isExpanded(id: string) {
    return this.expandedIds.has(id);
  }

  expandAll() {
    this.tasks.forEach((_, id) => this.expandedIds.add(id));
  }

  collapseAll() {
    this.expandedIds.clear();
  }

  // ------------- Searching -------------
  setSearchQuery(q: string) {
    this.searchQuery = q;
  }

  private matches(id: string) {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return true;
    const t = this.tasks.get(id);
    if (!t) return false;
    return t.title.toLowerCase().includes(q);
  }

  // show item if it matches OR any descendant matches (so tree path is visible)
  isVisibleInSearch(id: string): boolean {
    if (this.matches(id)) return true;
    const desc = getDescendants(this.tasks, id);
    return desc.some((d) => this.matches(d));
  }

  get filteredRootIds(): string[] {
    return this.rootIds.filter((id) => this.isVisibleInSearch(id));
  }

  // ------------- Active task & routing -------------
  setActiveTask(id: string | null) {
    this.activeTaskId = id;
  }

  get activeTask() {
    return this.activeTaskId ? this.tasks.get(this.activeTaskId) ?? null : null;
  }

  // ------------- Theme -------------
  setTheme(mode: ThemeMode) {
    this.theme = mode;
  }

  // ------------- Persistence -------------
  serialize(): SerializedStore {
    const tasksObj: Record<string, Task> = {};
    this.tasks.forEach((v, k) => (tasksObj[k] = toJS(v)));
    return {
      tasks: tasksObj,
      rootIds: toJS(this.rootIds),
      expandedIds: Array.from(this.expandedIds),
      selectedIds: Array.from(this.selectedIds),
      searchQuery: this.searchQuery,
      theme: this.theme,
      activeTaskId: this.activeTaskId,
      version: 1,
    };
  }

  hydrate() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as SerializedStore;
      this.tasks = new Map(Object.entries(data.tasks));
      this.rootIds = data.rootIds ?? [];
      this.expandedIds = new Set(data.expandedIds ?? []);
      this.selectedIds = new Set(data.selectedIds ?? []);
      this.searchQuery = data.searchQuery ?? "";
      this.theme = data.theme ?? "system";
      this.activeTaskId = data.activeTaskId ?? null;
    } catch (e) {
      console.warn("Failed to hydrate store", e);
    }
  }
}

export const taskStore = new TaskStore();
