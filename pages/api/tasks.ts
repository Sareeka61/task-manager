import type { NextApiRequest, NextApiResponse } from "next";
import type { Task, CreateTaskInput, TaskFilterStatus } from "@/types/task.types";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

let tasks: Task[] = [
    {
        id: "1",
        title: "Complete project proposal",
        description: "Draft Q3 proposal for client review",
        completed: false,
        createdAt: "2025-04-15",
    },
    {
        id: "2",
        title: "Review pull requests",
        description: "Review and merge team pull requests",
        completed: true,
        createdAt: "2025-04-14",
      },
];

// Fetch tasks, with or without filtering the status
router.get((req, res)=> {
    const status = req.query.status as TaskFilterStatus | undefined;

    let data = tasks;

    switch(status){
        case "completed":
            data=tasks.filter((t) => t.completed);
            break;
        
        case "incomplete":
            data = tasks.filter((t) => !t.completed);
            break;
        
        default:
            data = tasks;
    }

    res.status(200).json(data);
});

// Create a new task
router.post((req, res) => {
    const {title, description} = req.body as CreateTaskInput;

    if(!title || !description) {
        return res.status(400).json(
            {
                message: "Title and description are required."
            }
        );
    }

    const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    // Add new task to beginning of array
    tasks = [newTask, ...tasks];
    res.status(201).json(newTask);
});

// Toggle task completion status
router.patch((req, res) => {
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({message: "Task ID is required"});
    }

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if(taskIndex === -1) {
        return res.status(404).json({message: "Task not found"});
    }

    // Keep other task details unchanged and only flip completed status
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        completed: !tasks[taskIndex].completed,
    };

    res.status(200).json(tasks[taskIndex]);
});

export default router.handler({
    onError(err, req, res) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    },
});