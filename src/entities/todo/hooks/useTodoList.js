import { useState, useCallback } from 'react'
import { todoApi } from '../api/todoApi'
import { ValidationError } from '@shared/lib/validation/validateApi'

export const useTodoList = () => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleError = (error) => {
    if (error instanceof ValidationError) {
      setError('Invalid data received from server')
      console.error('Validation errors:', error.errors)
    } else {
      setError(error.message || 'Failed to fetch todos')
      console.error('API error:', error)
    }
  }

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await todoApi.getTodos()
      setTodos(data)
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      const updatedTodo = await todoApi.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      })

      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      handleError(error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      handleError(error)
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    toggleTodo,
    deleteTodo
  }
}
