export interface Task {
  id: string;
  task: string;
  description: string;
  time: string;
  done: boolean;
}

export interface NewTaskInput {
  task: string;
  description: string;
  time: string;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:4000/api";

const TASKS_URL = `${API_BASE_URL}/tasks`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body === "object" && "message" in body
        ? (body as { message?: string }).message
        : undefined) ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function fetchTasks(): Promise<Task[]> {
  return fetch(TASKS_URL).then((res) => handleResponse<Task[]>(res));
}

export function createTask(input: NewTaskInput): Promise<Task> {
  return fetch(TASKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, done: false }),
  }).then((res) => handleResponse<Task>(res));
}

export function updateTask(
  id: string,
  changes: Partial<Omit<Task, "id">>,
): Promise<Task> {
  return fetch(`${TASKS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  }).then((res) => handleResponse<Task>(res));
}

export function deleteTask(id: string): Promise<void> {
  return fetch(`${TASKS_URL}/${id}`, { method: "DELETE" }).then((res) =>
    handleResponse<void>(res),
  );
}

export function reorderTasks(ids: string[]): Promise<Task[]> {
  return fetch(`${TASKS_URL}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  }).then((res) => handleResponse<Task[]>(res));
}
