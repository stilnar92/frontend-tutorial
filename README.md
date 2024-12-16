# Todo Application with API Integration

This guide explains how to integrate an API with a React application using custom hooks and proper architecture.

## Table of Contents
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Custom Hooks](#custom-hooks)
- [Component Integration](#component-integration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Project Structure

```
src/
├── entities/
│   └── todo/
│       ├── api/
│       │   └── todoApi.js       # API methods
│       ├── hooks/
│       │   ├── useTodoList.js   # Todo list management
│       │   └── useTodoForm.js   # Form handling
│       └── model/
│           └── schema.js        # Validation schema
├── features/
│   ├── todo-create/
│   │   └── ui/
│   │       └── TodoForm/
│   └── todo-list/
│       └── ui/
│           ├── TodoList/
│           └── TodoListContainer/
└── shared/
    └── api/
        └── axios.js             # Axios instance
```

## API Integration

### 1. Setup Axios Instance

```javascript
// src/shared/api/axios.js
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### 2. Define API Methods

```javascript
// src/entities/todo/api/todoApi.js
import { axiosInstance } from '@shared/api/axios'

const ENDPOINTS = {
  GET_TODOS: '/todos',
  GET_TODO: (id) => `/todos/${id}`,
  CREATE_TODO: '/todos',
  UPDATE_TODO: (id) => `/todos/${id}`,
  DELETE_TODO: (id) => `/todos/${id}`
}

export const todoApi = {
  async getTodos() {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODOS)
    return data
  },

  async createTodo(todo) {
    const { data } = await axiosInstance.post(ENDPOINTS.CREATE_TODO, todo)
    return data
  },

  async updateTodo(id, todo) {
    const { data } = await axiosInstance.put(ENDPOINTS.UPDATE_TODO(id), todo)
    return data
  },

  async deleteTodo(id) {
    await axiosInstance.delete(ENDPOINTS.DELETE_TODO(id))
  }
}
```

## Custom Hooks

### 1. Todo List Management Hook

```javascript
// src/entities/todo/hooks/useTodoList.js
import { useState, useCallback } from 'react'
import { todoApi } from '../api/todoApi'

export const useTodoList = () => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await todoApi.getTodos()
      setTodos(data)
    } catch (error) {
      setError('Failed to fetch todos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id)
      const updatedTodo = await todoApi.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      })
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    toggleTodo
  }
}
```

### 2. Form Management Hook

```javascript
// src/entities/todo/hooks/useTodoForm.js
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema } from '../model/schema'
import { todoApi } from '../api/todoApi'

export const useTodoForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(todoSchema)
  })

  const onSubmit = async (data) => {
    try {
      await todoApi.createTodo(data)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  }
}
```

## Component Integration

### 1. Todo Form Component

```javascript
// src/features/todo-create/ui/TodoForm/TodoForm.jsx
import { useTodoForm } from '@entities/todo/hooks/useTodoForm'

const TodoForm = ({ onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting } = useTodoForm({
    onSuccess
  })

  return (
    <form onSubmit={handleSubmit}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}
```

### 2. Todo List Container

```javascript
// src/features/todo-list/ui/TodoListContainer/TodoListContainer.jsx
import { useEffect } from 'react'
import { useTodoList } from '@entities/todo/hooks/useTodoList'

const TodoListContainer = () => {
  const { todos, isLoading, error, fetchTodos } = useTodoList()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return <TodoList todos={todos} />
}
```

## Error Handling

### 1. API Level

```javascript
// src/shared/api/axios.js
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error)
  }
)
```

### 2. Hook Level

```javascript
const useTodoList = () => {
  const handleError = (error) => {
    if (error.response?.status === 404) {
      setError('Todos not found')
    } else {
      setError('Failed to fetch todos')
    }
  }

  const fetchTodos = async () => {
    try {
      // ... fetch logic
    } catch (error) {
      handleError(error)
    }
  }
}
```

## Best Practices

1. **API Organization**
   - Keep API methods in separate files
   - Use constants for endpoints
   - Implement proper error handling

2. **Custom Hooks**
   - Separate data fetching logic from components
   - Handle loading and error states
   - Provide clear interfaces

3. **Components**
   - Keep components focused on rendering
   - Use container/presenter pattern
   - Handle loading and error states gracefully

4. **Error Handling**
   - Implement global error handling
   - Show user-friendly error messages
   - Log errors for debugging

5. **State Management**
   - Use local state for UI-specific data
   - Consider global state for shared data
   - Optimize re-renders

## Resources

- [Axios Documentation](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
