import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

 
  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  
  const createBoard = async (e) => {
    e.preventDefault();
    if (!title) return;

    const res = await api.post("/boards", { title });
    setBoards([...boards, res.data]);
    setTitle("");
  };

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Your Boards
      </h1>

    
      <form
        onSubmit={createBoard}
        className="mb-8 flex gap-3"
      >
        <input
          placeholder="New board title"
          className="border p-3 rounded-lg w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          Create Board
        </button>
      </form>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board._id}
            onClick={() => navigate(`/board/${board._id}`)}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"

          >
            <h2 className="text-lg font-semibold">
              {board.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  </div>
);


}
