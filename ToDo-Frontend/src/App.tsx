import { useState, type Dispatch } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { task: "Städa", description: "Städa rummet och toan", time: "14:00" },
  ]);
  const [showAddTask, setShowAddTak] = useState<boolean>(false);

  const AddTask = () => {
    const [newTask, setNewTask] = useState({
      task: "",
      description: "",
      time: "",
    });

    const addTask = (e: any) => {
      e.preventDefault();

      setTasks((prev) => [...prev, newTask]);
      console.log(newTask);
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
            type="text"
            placeholder="Time"
            value={newTask.time}
            minLength={5}
            defaultValue="00:00"
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, time: e.target.value }))
            }
          />
          <input type="submit" value="Add task"></input>
        </form>
      </div>
    );
  };
  const [done, setDone] = useState(false);
  return (
    <div className="container">
      <div className="tasks">
        <ul>
          {tasks.map((task) => (
            <div
              className="task"
              style={
                done ? { backgroundColor: "blue" } : { backgroundColor: "red" }
              }
              onClick={() => setDone(!done)}
            >
              <h5> {task.time}</h5>
              <h3>
                <div>{task.task}</div>
              </h3>
            </div>
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
