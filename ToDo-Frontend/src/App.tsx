import { useState, type FormEvent } from "react";
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
import "./App.css";

interface Task {
  id: string;
  task: string;
  description: string;
  time: string;
  done: boolean;
}

interface AddTaskProps {
  onAdd: (task: Task) => void;
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

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd({ ...newTask, id: crypto.randomUUID(), done: false });
    setNewTask(emptyTask);
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
      <button type="submit">Lägg till</button>
    </form>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => [
    {
      id: crypto.randomUUID(),
      task: "Städa",
      description: "Städa rummet och toan",
      time: "14:00",
      done: false,
    },
    {
      id: crypto.randomUUID(),
      task: "Handla mat",
      description: "Köp mjölk, ägg och bröd till veckan",
      time: "17:30",
      done: false,
    },
    {
      id: crypto.randomUUID(),
      task: "Träna",
      description: "30 minuter löpning eller styrketräning",
      time: "07:00",
      done: true,
    },
    {
      id: crypto.randomUUID(),
      task: "Plugga React",
      description: "Gå igenom useState och komponenter en timme",
      time: "20:00",
      done: false,
    },
  ]);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="container">
      <div className="tasks">
        <h1 className="appTitle">Att göra!</h1>
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
