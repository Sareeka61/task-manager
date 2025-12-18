import type { TaskItemProps } from "@/types/components.types";

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
    return (
        <div
        className={`p-4 border rounded-lg mb-3 transition-all ${
          task.completed
            ? "bg-green-50 border-green-200"
            : "bg-white border-gray-200 hover:border-blue-300"
        }`}
      >
             <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-900 mb-1 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-sm mb-2 ${
              task.completed ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span
              className={`px-2 py-1 rounded-full font-medium ${
                task.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {task.completed ? "Completed" : " Incomplete"}
              </span>
              <span className="md:italic">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => onToggle(task.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            task.completed
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {task.completed ? "Done" : "Mark As Done"}
        </button>
      </div>
    </div>
    );
};

export default TaskItem;