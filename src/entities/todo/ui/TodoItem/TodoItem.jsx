import { cva } from 'class-variance-authority'

const todoItemVariants = cva(
  'flex items-center gap-2 p-4 border rounded-lg shadow-sm transition-all',
  {
    variants: {
      completed: {
        true: 'bg-gray-50',
        false: 'bg-white',
      },
    },
    defaultVariants: {
      completed: false,
    },
  }
)

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={todoItemVariants({ completed: todo.completed })}>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className='h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
      />
      <span
        className={`flex-1 text-sm ${
          todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className='text-red-500 hover:text-red-700'
      >
        Delete
      </button>
    </div>
  )
}

export default TodoItem
