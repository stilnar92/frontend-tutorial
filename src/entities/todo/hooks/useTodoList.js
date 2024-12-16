import { useState, useCallback } from 'react'
import { todoApi } from '../api/todoApi'

export const useTodoList = () => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await todoApi.getTodos()
      setTodos(data)
    } catch (error) {
      setError('Failed to fetch todos')
      console.error('Error fetching todos:', error)
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
      console.error('Failed to toggle todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoApi.deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
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
