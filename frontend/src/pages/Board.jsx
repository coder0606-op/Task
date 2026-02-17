import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import List from "../components/List";
import socket from "../socket";
import { DndContext, closestCenter } from "@dnd-kit/core";

export default function Board() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [email, setEmail] = useState("");


  const fetchBoard = async () => {
    const res = await api.get("/boards");
    const found = res.data.find((b) => b._id === id);
    setBoard(found);
  };

  const fetchLists = async () => {
    const res = await api.get(`/lists/${id}`);
    setLists(res.data);
  };

  
  const fetchTasks = async () => {
    const res = await api.get(`/tasks/${id}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchBoard();
    fetchLists();
    fetchTasks();

    socket.emit("join-board", id);

    const handleTaskUpdate = () => fetchTasks();
    const handleListUpdate = () => fetchLists();

    socket.on("task-updated", handleTaskUpdate);
    socket.on("list-updated", handleListUpdate);

    return () => {
      socket.off("task-updated", handleTaskUpdate);
      socket.off("list-updated", handleListUpdate);
    };
  }, [id]);

  
  const createList = async (e) => {
    e.preventDefault();
    if (!listTitle) return;

    const res = await api.post("/lists", {
      title: listTitle,
      boardId: id,
      order: lists.length + 1,
    });

    socket.emit("list-update", {
      boardId: id,
      list: res.data,
    });

    setListTitle("");
    fetchLists();
  };

  
  const addMember = async (e) => {
    e.preventDefault();
    if (!email) return;

    await api.post("/boards/add-member", {
      boardId: id,
      email,
    });

    setEmail("");
    fetchBoard();
  };

 
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newListId = over.id;

    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const res = await api.put(`/tasks/${taskId}`, {
      listId: newListId,
    });

    socket.emit("task-update", {
      boardId: id,
      task: res.data,
    });

    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     <h1 className="text-3xl font-bold mb-6">

        {board?.title || "Board"}
      </h1>

      
      <form onSubmit={addMember} className="mb-4">
        <input
          placeholder="Add member by email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
          Add Member
        </button>
      </form>

    
      <form onSubmit={createList} className="mb-6">
        <input
          placeholder="New list title"
          className="border p-2 rounded"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Add List
        </button>
      </form>

      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto">

          {lists.map((list) => (
            <List
              key={list._id}
              list={list}
              tasks={tasks.filter((t) => t.listId === list._id)}
              refreshTasks={fetchTasks}
              members={board?.members || []}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
