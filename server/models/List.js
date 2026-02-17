import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: Number,
  },
  { timestamps: true }
);

export default mongoose.model("List", listSchema);
