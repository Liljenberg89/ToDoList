import { useState, type Dispatch } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(["Städa", "Handla", "Laga mat"]);
  const [showAddTask, setShowAddTak] = useState<boolean>(false);

  const AddTask = () => {
    const [newTask, setNewTask] = useState({
      task: "",
      description: "",
      time: "",
    });

    const addTask = (e: any) => {
      e.preventDefault();

      // Lägg till task här
      console.log(newTask);
    };
    return (
      <div>
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task"
            value={newTask.task}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, task: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Time"
            value={newTask.time}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, time: e.target.value }))
            }
          />
          <input type="submit" value="Add task"></input>
        </form>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="tasks">
        <ul>
          {tasks.map((task) => (
            <div className="task">{task}</div>
          ))}
        </ul>
        <button className="addTask" onClick={() => setShowAddTak(!showAddTask)}>
          Add task{" "}
        </button>
        {!showAddTask ? "" : <AddTask />}
      </div>
    </div>
  );
}

export default App;
