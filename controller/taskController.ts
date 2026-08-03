import { Request, Response } from "express";
import Task from "../model/taskModel";
import { AuthRequest } from "../types/AuthRequest";

// Create Task
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, tag, note } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    if (!description) {
      res.status(400).json({ message: "Description is required" });
      return;
    }

    if (!tag || tag.length === 0) {
      res.status(400).json({ message: "At least one tag is required" });
      return;
    }

    const newTask = await Task.create({
      title,
      description,
      tag,
      note,
      user: req.user!._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : error,
    });
  }
};

// Get Tasks
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({
      user: req.user!._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : error,
    });
  }
};

// Update Task
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found or not yours",
      });
      return;
    }

    Object.assign(task, req.body);

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : error,
    });
  }
};

// Delete Task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found or not yours",
      });
      return;
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : error,
    });
  }
};