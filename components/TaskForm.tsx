import { useState } from "react";
import type { TaskFormProps } from "@/types/components.types";

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!title || !description) return;

        setIsSubmitting(true);
        try {
            await onTaskCreated({title: title, description:description})
            setTitle("");
            setDescription("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Task</h2>   
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                <input
                id="title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                <textarea
                id="description"
                placeholder="Enter task description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                disabled={isSubmitting}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                rows={3}
                required
                />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !title || !description}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Creating..." : "Add Task"}
            </button>
        </form>
        </div>
    )
}

export default TaskForm;