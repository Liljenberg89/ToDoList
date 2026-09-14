# ToDo-Backend

Express + TypeScript API backed by MongoDB (Mongoose) for the ToDoList app.

## Setup

1. Copy the env file and adjust as needed:
   ```
   cp .env.example .env
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure MongoDB is running locally (or point `MONGODB_URI` at Atlas/another instance).
4. Start the dev server (auto-restarts on changes):
   ```
   npm run dev
   ```

The API listens on `http://localhost:4000` by default.

## Scripts

- `npm run dev` — run with nodemon + ts-node
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled build
- `npm run lint` — type-check without emitting

## API

Base path: `/api/tasks`

| Method | Path             | Description                              |
| ------ | ---------------- | ----------------------------------------- |
| GET    | `/`               | List all tasks, ordered by `order`        |
| POST   | `/`               | Create a task (`task`, `description`, `time`, `done`) |
| PATCH  | `/:id`            | Update a task                             |
| DELETE | `/:id`            | Delete a task                             |
| PATCH  | `/reorder`        | Body `{ ids: string[] }` — persist new drag-and-drop order |

`GET /health` returns `{ status: "ok" }`.

## Task shape

```ts
{
  id: string;
  task: string;
  description: string;
  time: string;
  done: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```
