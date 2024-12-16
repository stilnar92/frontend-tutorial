import React, { useEffect } from 'react'
import { TodoForm } from '@/features/todo-create/ui/TodoForm'
import { TodoListContainer } from '@/features/todo-list/ui/TodoListContainer'
import { useTodoList } from '@/entities/todo/hooks/useTodoList'

export const HomePage = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <TodoForm />
        </div>
        <TodoListContainer
          todos={todos}
          isLoading={isLoading}
          error={error}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}
