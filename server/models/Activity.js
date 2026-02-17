import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    boardId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    details: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
