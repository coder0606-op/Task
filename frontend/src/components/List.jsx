import { useState } from "react";
import api from "../api/axios";
import Task from "./Task";
import socket from "../socket";
import { useDroppable } from "@dnd-kit/core";

export default function List({ list, tasks, refreshTasks, members }) {
  const [title, setTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: list._id,
  });

  const createTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    const res = await api.post("/tasks", {
      title,
      boardId: list.boardId,
      listId: list._id,
      order: tasks.length + 1,
    });

    socket.emit("task-update", {
      boardId: list.boardId,
      task: res.data,
    });

    setTitle("");
    refreshTasks();
  };

  return (
   <div
  ref={setNodeRef}
  className="bg-white p-4 rounded-xl w-72 min-h-[150px] shadow"
>

     <h3 className="font-semibold mb-4 text-gray-700">
  {list.title}
</h3>


      <div className="space-y-2 mb-3">
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            members={members}
            refreshTasks={refreshTasks}
          />
        ))}
      </div>

     
      <form onSubmit={createTask}>
        <input
          placeholder="New task"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </div>
  );
}
