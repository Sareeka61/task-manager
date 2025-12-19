## Task Manager App

A simple app to manage tasks built using Next.js

### Features
- Create new tasks with title and description
- Mark test as done or incomplete.
- Filter tasks i.e. all, completed, incomplete
- Toast notifications for major actions
- Responsive design

### Tech Stack
- Framework: Next.js (with API routes)
- Language: TS
- UI Library: React 18+ with Hooks 
- Styling: Tailwind CSS
- Notifications: React Hot Toast
- Routing: next-connect for API routes

### Getting Started

Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Netlify Link: [View Live](https://taskmanager-assessment.netlify.app/)

### Project Structure
```
├── pages/
|   ├──_app.tsx
│   ├── index.tsx          # Main page
│   └── api/
|       ├── tasks.ts       # API endpoints
├── components/
│   ├── TaskForm.tsx       # Create task form
│   └── TaskItem.tsx       # Task card
└── types/
|   ├── task.types.ts      # Task types
|   └── components.types.ts # Component types
├── styles/
│   ├── globals.css
└──  
```

### How it works

#### Data Storage
Tasks are stored in server memory(in-memory array).

#### API routes
**GET /api/tasks** - Fetch all tasks

**POST /api/tasks** - Create new task
```json
{
    "title": "Title of task",
    "description": "Description of task"
}
```
**PATCH /api/tasks** - Toggle task completion
```json
{
    "id":"task-id"
}
```

**Home Page** (`pages/index.tsx`)
- Manages all the state
- Fetches and displays tasks
- Handles filtering
- Opens/closes the create task modal

**TaskForm** (`components/TaskForm.tsx`)
- Form to create new tasks
- Shows in a modal
- Validates input

**TaskItem** (`components/TaskItem.tsx`)
- Shows individual task
- Toggle complete/incomplete button
- Different styling for completed task

#### React Hooks & State Management

**useState** - Managing component state
- `tasks` & `allTasks` - Store task lists (filtered and complete)
- `loading` - Show spinner while fetching data
- `filter` - Track current filter selection (all/completed/incomplete)
- `isModalOpen` - Control modal visibility
- `title` & `description` - Form input values in TaskForm

**useEffect** - Side effects
- Fetch tasks when component mounts
- Update displayed tasks when filter changes

**useCallback** - Prevent unnecessary re-renders
- `fetchTasks` - Fetch function stays the same between renders
- `handleToggle` - Toggle function doesn't recreate on every render
- `handleTaskCreated` - Create task handler
- Form handlers in TaskForm (handleSubmit, handleCancel)

**useMemo** - Remembers values so it doesn't recalculate them every time
- `filterButtons` - Only recalculate when allTasks changes
- `emptyStateMessage` - Only update when filter changes

This keeps the app fast and prevents components from re-rendering unnecessarily.