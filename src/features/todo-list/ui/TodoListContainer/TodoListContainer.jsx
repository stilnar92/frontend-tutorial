import { useEffect } from 'react'
import { useTodoList } from '@entities/todo/hooks/useTodoList'
import TodoList from '../TodoList/TodoList'

const TodoListContainer = () => {
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    toggleTodo,
    deleteTodo
  } = useTodoList()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

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
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
  )
}

export default TodoListContainer
