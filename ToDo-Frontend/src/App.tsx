import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
}

function TaskItem({ task, onToggleDone }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className={task.done ? "task done" : "task"}>
      <div className="taskHeader" onClick={() => onToggleDone(task.id)}>
        <h5>{task.time}</h5>
        <h3>{task.task}</h3>
        <button
          className={expanded ? "expandButton expanded" : "expandButton"}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
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

  const addTask = (e: any) => {
    e.preventDefault();

    onAdd({ ...newTask, id: crypto.randomUUID(), done: false });
    setNewTask(emptyTask);
  };

  return (
    <div>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task"
          minLength={3}
          value={newTask.task}
          required
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, task: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Description"
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
        <input type="submit" value="Add task"></input>
      </form>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: crypto.randomUUID(),
      task: "Städa",
      description: "Städa rummet och toan",
      time: "14:00",
      done: false,
    },
  ]);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setShowAddTask(false);
  };

  return (
    <div className="container">
      <div className="tasks">
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleDone={toggleDone} />
          ))}
        </ul>
        <button
          className="addTask"
          onClick={() => setShowAddTask(!showAddTask)}
        >
          Add task{" "}
        </button>
        {!showAddTask ? "" : <AddTask onAdd={addTask} />}
      </div>
    </div>
  );
}

export default App;
