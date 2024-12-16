import { memo } from 'react'
import TodoItem from '@entities/todo/ui/TodoItem'

const TodoList = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No todos yet. Add some!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TodoList)