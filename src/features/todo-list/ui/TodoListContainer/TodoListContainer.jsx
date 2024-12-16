import { useEffect } from 'react'
import { TodoList } from '../TodoList/TodoList'

export const TodoListContainer = ({ 
  todos, 
  isLoading, 
  error, 
  onToggle, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading todos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    )
  }

  return (
    <TodoList
      todos={todos}
      onToggle={onToggle}
      onDelete={onDelete}
    />
  )
}
