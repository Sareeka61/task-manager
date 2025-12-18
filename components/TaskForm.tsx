import { useState, useCallback } from "react";
import type { TaskFormProps } from "@/types/components.types";

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
        setTitle("");
        setDescription("");
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        try {
            await onTaskCreated({ 
                title: title.trim(), 
                description: description.trim() 
            });
            resetForm();
            onClose?.();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [title, description, onTaskCreated, onClose, resetForm]);

    const handleCancel = useCallback(() => {
        resetForm();
        onClose?.();
    }, [onClose, resetForm]);

    return (
        <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Task</h2>   
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="title" 
                        className="block text-sm font-medium text-gray-800 mb-1"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label 
                        htmlFor="description" 
                        className="block text-sm font-medium text-gray-800 mb-1"
                    >
                        Description
                    </label>
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

                <div className="flex gap-3">
                    {onClose && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !description.trim()}
                        className={`${onClose ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                    >
                        {isSubmitting ? "Creating..." : "Add Task"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;