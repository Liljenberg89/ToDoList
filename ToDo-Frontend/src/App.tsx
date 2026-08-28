import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(["Städa", "Handla", "Laga mat"]);

  return (
    <body>
      <div className="tasks">
        <ul>
          {tasks.map((task) => (
            <div className="task">{task}</div>
          ))}
        </ul>
        <button className="addTask">Add task </button>
      </div>
    </body>
  );
}

export default App;
