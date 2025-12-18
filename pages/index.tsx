import { useEffect, useState, useCallback, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Plus, X } from "lucide-react";
import type { Task, CreateTaskInput, TaskFilterStatus } from "@/types/task.types";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) 
        throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setAllTasks(data);
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on selected filter
  useEffect(() => {
    const filteredTasks = (() => {
      switch (filter) {
        case "completed":
          return allTasks.filter((t) => t.completed);
        case "incomplete":
          return allTasks.filter((t) => !t.completed);
        default:
          return allTasks;
      }
    })();
    setTasks(filteredTasks);
  }, [filter, allTasks]);

  const handleTaskCreated = useCallback(async (input: CreateTaskInput) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) 
        throw new Error("Failed to create task");

      const newTask = await res.json();
      setAllTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to create task");
      console.error(err);
    }
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    setAllTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) 
        throw new Error("Failed to toggle task");

      const updatedTask = await res.json();
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task marked incomplete"
      );
    } catch (err) {
      setAllTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      toast.error("Failed to update task");
      console.error(err);
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Prevent filter buttons from re-rendering unnecessarily by memoizing them
  const filterButtons = useMemo(() => [
    { value: "all" as TaskFilterStatus, label: "All", count: allTasks.length },
    {
      value: "incomplete" as TaskFilterStatus,
      label: "Incomplete",
      count: allTasks.filter((t) => !t.completed).length,
    },
    {
      value: "completed" as TaskFilterStatus,
      label: "Completed",
      count: allTasks.filter((t) => t.completed).length,
    },
  ], [allTasks]);

  const emptyStateMessage = useMemo(() => {
    if (filter === "all") {
      return "No tasks yet. Create one to get started!";
    }
    return `No ${filter} tasks found.`;
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <Toaster position="top-right" />
      
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Manager</h1>
        </header>

        <nav className="flex gap-2 mb-6" role="navigation" aria-label="Task filters">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === btn.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
              aria-pressed={filter === btn.value}
            >
              {btn.label}
              <span className="ml-2 text-sm opacity-75">({btn.count})</span>
            </button>
          ))}
        </nav>

        <main>
          {loading ? (
            <div className="flex items-center justify-center py-12" role="status">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="sr-only">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">{emptyStateMessage}</p>
            </div>
          ) : (
            <div role="list">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </main>
      </div>

      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label="Add new task"
      >
        <Plus size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal for task creation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={handleCloseModal}
              aria-hidden="true"
            ></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <TaskForm onTaskCreated={handleTaskCreated} onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}