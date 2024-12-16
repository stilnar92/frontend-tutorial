import { memo } from 'react'

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
      />
      
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {todo.title}
      </span>
      
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TodoItem)
