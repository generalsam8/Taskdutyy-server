import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  tag: "important" | "urgent";
  note: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      enum: ["important", "urgent"],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;