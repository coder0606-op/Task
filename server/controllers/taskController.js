import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      boardId: req.params.boardId,
    })
      .populate("assignedTo", "name email")
      .sort("order");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

   
    Object.assign(task, req.body);

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
