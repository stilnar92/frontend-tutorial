# Custom Hooks Implementation Guide

## Step 1: useLocalStorage Hook

```javascript
// src/shared/lib/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`)
    }
  }, [key, value])

  return [value, setValue]
}
```

## Step 2: useTodos Hook

```javascript
// src/entities/todo/model/hooks/useTodos.js
import { useCallback } from 'react'
import { useLocalStorage } from '@shared/lib/hooks/useLocalStorage'

export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage('todos', [])

  const addTodo = useCallback((title) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      title,
      completed: false
    }])
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

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted }
}
```

## Step 3: useForm Hook

```javascript
// src/shared/lib/hooks/useForm.js
import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault()
    const newErrors = {}
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        newErrors[key] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values)
      setValues(initialValues)
    } else {
      setErrors(newErrors)
    }
  }, [values, initialValues])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return { values, errors, handleChange, handleSubmit, reset }
}
```

## Step 4: useKeyPress Hook

```javascript
// src/shared/lib/hooks/useKeyPress.js
import { useEffect, useCallback } from 'react'

export const useKeyPress = (targetKey, callback, deps = []) => {
  const handleKeyPress = useCallback((event) => {
    if (event.key === targetKey) {
      callback(event)
    }
  }, [targetKey, callback])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, ...deps])
}
```

## Step 5: Usage in Components

### TodoForm Component
```javascript
const TodoForm = ({ onSubmit }) => {
  const { values, errors, handleChange, handleSubmit, reset } = useForm({ title: '' })
  useKeyPress('Escape', reset)

  return (
    <form onSubmit={handleSubmit((values) => {
      onSubmit(values.title)
      reset()
    })}>
      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
      />
      {errors.title && <span>{errors.title}</span>}
      <button type="submit">Add</button>
    </form>
  )
}
```

### TodoApp Component
```javascript
const TodoApp = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  
  useKeyPress('c', (e) => {
    if (e.altKey) clearCompleted()
  })

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      <button onClick={clearCompleted}>Clear Completed (Alt+C)</button>
    </div>
  )
}
