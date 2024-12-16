import { useCallback } from 'react'
import { useLocalStorage } from '@shared/lib/hooks/useLocalStorage'

export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage('todos', [])

  const addTodo = useCallback((title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
  }, [setTodos])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [setTodos])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [setTodos])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [setTodos])

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
  }
}
