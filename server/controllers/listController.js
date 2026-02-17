import List from "../models/List.js";

export const createList = async (req, res) => {
  const list = await List.create(req.body);
  res.json(list);
};

export const getLists = async (req, res) => {
  const lists = await List.find({
    boardId: req.params.boardId,
  }).sort("order");

  res.json(lists);
};
