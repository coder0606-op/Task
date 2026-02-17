import { useDraggable } from "@dnd-kit/core";
import api from "../api/axios";
import socket from "../socket";

export default function Task({ task, members, refreshTasks }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task._id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const assignUser = async (userId) => {
    const res = await api.put(`/tasks/${task._id}`, {
      assignedTo: [userId],
    });

    socket.emit("task-update", {
      boardId: task.boardId,
      task: res.data,
    });

    refreshTasks();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition"

    >
     <div className="font-medium text-gray-800">
  {task.title}
</div>


{task.assignedTo && task.assignedTo.length > 0 && (
  <div className="text-xs text-blue-600 mt-1 font-medium">

    Assigned to: {task.assignedTo[0].name}
  </div>
)}

      <select
  className="mt-2 w-full border p-1 text-sm"
  onChange={(e) => assignUser(e.target.value)}
  value={task.assignedTo?.[0]?._id || ""}
>
  <option value="">Assign user</option>
  {members.map((user) => (
    <option key={user._id} value={user._id}>
      {user.name}
    </option>
  ))}
</select>

    </div>
  );
}
