import { useEffect, useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCheck,
  faGripVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskRequest,
  reorderTasks,
  type Task,
  type NewTaskInput,
} from "./api/tasks";
import "./App.css";

interface AddTaskProps {
  onAdd: (task: NewTaskInput) => Promise<void>;
}

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskItem({ task, onToggleDone, onDelete }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={task.done ? "task done" : "task"}
    >
      <div className="taskHeader" onClick={() => onToggleDone(task.id)}>
        <button
          className="dragHandle"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Dra för att ändra ordning"
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </button>
        <button
          className="doneIndicator"
          aria-pressed={task.done}
          aria-label={task.done ? "Markera som ej klar" : "Markera som klar"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(task.id);
          }}
        >
          {task.done && <FontAwesomeIcon icon={faCheck} />}
        </button>
        <span className="taskTime">{task.time}</span>
        <span className="taskTitle">{task.task}</span>
        <button
          className="deleteButton"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          aria-label="Ta bort uppgift"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          className={expanded ? "expandButton expanded" : "expandButton"}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          aria-label={expanded ? "Dölj beskrivning" : "Visa beskrivning"}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
      {expanded && <p className="taskDescription">{task.description}</p>}
    </li>
  );
}

function AddTask({ onAdd }: AddTaskProps) {
  const emptyTask = { task: "", description: "", time: "" };
  const [newTask, setNewTask] = useState(emptyTask);
  const [submitting, setSubmitting] = useState(false);

  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAdd(newTask);
      setNewTask(emptyTask);
    } catch {
      // Felet visas av föräldrakomponenten; behåll fälten så användaren kan försöka igen.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="addTaskForm" onSubmit={addTask}>
      <input
        type="text"
        placeholder="Uppgift"
        minLength={3}
        value={newTask.task}
        required
        onChange={(e) =>
          setNewTask((prev) => ({ ...prev, task: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="Beskrivning"
        value={newTask.description}
        required
        onChange={(e) =>
          setNewTask((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <input
        type="time"
        lang="sv-SE"
        className="timeInput"
        value={newTask.time}
        onClick={(e) => e.currentTarget.showPicker?.()}
        onChange={(e) =>
          setNewTask((prev) => ({ ...prev, time: e.target.value }))
        }
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Lägger till…" : "Lägg till"}
      </button>
    </form>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    fetchTasks()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Kunde inte hämta uppgifter",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleDone = (id: string) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const nextDone = !current.done;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: nextDone } : t)),
    );
    setError(null);

    updateTask(id, { done: nextDone }).catch((err: unknown) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: current.done } : t)),
      );
      setError(
        err instanceof Error ? err.message : "Kunde inte uppdatera uppgiften",
      );
    });
  };

  const addTask = async (input: NewTaskInput) => {
    setError(null);
    try {
      const created = await createTask(input);
      setTasks((prev) => [...prev, created]);
      setShowAddTask(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunde inte lägga till uppgiften",
      );
      throw err;
    }
  };

  const deleteTask = (id: string) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const removed = tasks[index];

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setError(null);

    deleteTaskRequest(id).catch((err: unknown) => {
      setTasks((prev) => {
        const next = [...prev];
        next.splice(index, 0, removed);
        return next;
      });
      setError(
        err instanceof Error ? err.message : "Kunde inte ta bort uppgiften",
      );
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const previous = tasks;
    const oldIndex = previous.findIndex((t) => t.id === active.id);
    const newIndex = previous.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(previous, oldIndex, newIndex);

    setTasks(reordered);
    setError(null);

    reorderTasks(reordered.map((t) => t.id)).catch((err: unknown) => {
      setTasks(previous);
      setError(
        err instanceof Error ? err.message : "Kunde inte spara ny ordning",
      );
    });
  };

  return (
    <div className="container">
      <div className="tasks">
        <h1 className="appTitle">Att göra!</h1>
        {error && <p className="errorMessage">{error}</p>}
        {loading ? (
          <p className="statusMessage">Laddar uppgifter…</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleDone={toggleDone}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
        <button
          className="addTask"
          onClick={() => setShowAddTask(!showAddTask)}
        >
          {showAddTask ? "Avbryt" : "+ Lägg till uppgift"}
        </button>
        {showAddTask && <AddTask onAdd={addTask} />}
      </div>
    </div>
  );
}

export default App;
