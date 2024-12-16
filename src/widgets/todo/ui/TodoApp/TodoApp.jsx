import { useState, useCallback } from 'react'
import TodoList from '@features/todo-list/ui/TodoList/TodoList'
import TodoForm from '@features/todo-create/ui/TodoForm/TodoForm'

const TodoApp = () => {
  const [todos, setTodos] = useState([])

  // Add new todo
  const handleSubmit = useCallback((title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
  }, [])

  // Toggle todo completion
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  // Delete todo
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo App</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>
          <TodoForm onSubmit={handleSubmit} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todo List</h2>
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default TodoApp
