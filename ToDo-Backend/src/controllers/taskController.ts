import type { Request, Response, NextFunction } from "express";
import Task from "../models/Task";

export async function getTasks(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tasks = await Task.find().sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { task, description, time, done } = req.body;

    const highest = await Task.findOne().sort({ order: -1 });
    const order = highest ? (highest.order as number) + 1 : 0;

    const created = await Task.create({
      task,
      description,
      time,
      done: done ?? false,
      order,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { task, description, time, done } = req.body;

    const updated = await Task.findByIdAndUpdate(
      id,
      { task, description, time, done },
      { new: true, runValidators: true, omitUndefined: true },
    );

    if (!updated) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function reorderTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      res.status(400).json({ message: "ids must be an array of strings" });
      return;
    }

    await Promise.all(
      ids.map((id, index) =>
        Task.findByIdAndUpdate(id, { order: index }).exec(),
      ),
    );

    const tasks = await Task.find().sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}
