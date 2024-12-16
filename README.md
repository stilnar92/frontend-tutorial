# React Hooks Guide

A comprehensive guide to React hooks, their usage patterns, and best practices.

## Core Hooks

### 1. useState
```jsx
const [state, setState] = useState(initialValue)
```

**Use Cases:**
- Managing form inputs
- Toggle states (show/hide)
- Counter values
- Any simple state

**Best Practices:**
```jsx
// With primitive value
const [count, setCount] = useState(0)
setCount(count + 1)

// With object
const [user, setUser] = useState({ name: '', age: 0 })
setUser(prev => ({ ...prev, name: 'John' }))

// With array
const [items, setItems] = useState([])
setItems(prev => [...prev, newItem])
```

### 2. useEffect
```jsx
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code
  }
}, [dependencies])
```

**Use Cases:**
- Data fetching
- Subscriptions
- DOM manipulations
- Side effects

**Patterns:**
```jsx
// Run once on mount
useEffect(() => {
  // Effect code
}, [])

// Run on dependency change
useEffect(() => {
  // Effect code
}, [dependency])

// Cleanup pattern
useEffect(() => {
  const subscription = subscribe()
  return () => unsubscribe(subscription)
}, [])
```

### 3. useCallback
```jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(dependency)
  },
  [dependency]
)
```

**Use Cases:**
- Memoizing event handlers
- Callbacks passed to optimized child components
- Preventing infinite loops in useEffect

**Example:**
```jsx
const handleSubmit = useCallback((value) => {
  setItems(prev => [...prev, value])
}, []) // Empty deps if not using any external values
```

### 4. useMemo
```jsx
const memoizedValue = useMemo(
  () => computeExpensiveValue(dependency),
  [dependency]
)
```

**Use Cases:**
- Expensive calculations
- Preventing unnecessary re-renders
- Memoizing objects for useEffect dependencies

**Example:**
```jsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => b.priority - a.priority)
}, [items])
```

### 5. useRef
```jsx
const refContainer = useRef(initialValue)
```

**Use Cases:**
- Storing mutable values
- DOM element references
- Previous value storage

**Examples:**
```jsx
// DOM reference
const inputRef = useRef(null)
<input ref={inputRef} />

// Storing previous value
const prevCount = useRef()
useEffect(() => {
  prevCount.current = count
}, [count])
```

## Custom Hooks

### Creating Custom Hooks
```jsx
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  
  const handleChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  
  return {
    value,
    onChange: handleChange
  }
}

// Usage
function Form() {
  const nameInput = useFormInput('')
  return <input {...nameInput} />
}
```

### Common Custom Hooks

**1. useToggle**
```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])
  
  return [value, toggle]
}
```

**2. useLocalStorage**
```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }, [key])

  return [storedValue, setValue]
}
```

## React Hooks Implementation Guide

## Table of Contents
1. [Core Hooks Overview](#core-hooks-overview)
2. [Step-by-Step Implementation](#step-by-step-implementation)
3. [Debugging Guide](#debugging-guide)

## Step-by-Step Implementation

### Step 1: Setting up TodoApp State
```jsx
// src/widgets/todo/ui/TodoApp/TodoApp.jsx
import { useState, useCallback } from 'react'
import TodoList from '@features/todo-list/ui/TodoList'
import TodoForm from '@features/todo-create/ui/TodoForm'

const TodoApp = () => {
  // 1. Initialize todos state
  const [todos, setTodos] = useState([])

  // 2. Create handler for adding todos
  const handleSubmit = useCallback((title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
  }, [])

  // 3. Create handler for toggling todos
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  // 4. Create handler for deleting todos
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <TodoForm onSubmit={handleSubmit} />
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

### Step 2: Implementing Form State
```jsx
// src/features/todo-create/ui/TodoForm/TodoForm.jsx
import { useState, useCallback } from 'react'

const TodoForm = ({ onSubmit }) => {
  // 1. Initialize form state
  const [title, setTitle] = useState('')

  // 2. Create submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    onSubmit(title)
    setTitle('') // Reset form after submission
  }, [title, onSubmit])

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit">Add Todo</button>
    </form>
  )
}
```

### Step 3: Optimizing TodoList with memo
```jsx
// src/features/todo-list/ui/TodoList/TodoList.jsx
import { memo } from 'react'
import TodoItem from '@entities/todo/ui/TodoItem'

// Wrap component with memo to prevent unnecessary re-renders
const TodoList = memo(({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return <div>No todos yet!</div>
  }

  return (
    <div>
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
})
```

### Step 4: Creating Optimized TodoItem
```jsx
// src/entities/todo/ui/TodoItem/TodoItem.jsx
import { memo } from 'react'

const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'line-through' : ''}>
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </div>
  )
})
```

### Step 5: Adding Custom Hooks (Optional)

#### useLocalTodos Hook
```jsx
// src/entities/todo/model/hooks/useLocalTodos.js
import { useState, useCallback } from 'react'

export const useLocalTodos = () => {
  const [todos, setTodos] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo
  }
}
```

### Step 6: Using Custom Hook in TodoApp
```jsx
// src/widgets/todo/ui/TodoApp/TodoApp.jsx
import { useLocalTodos } from '@entities/todo/model/hooks/useLocalTodos'

const TodoApp = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useLocalTodos()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <TodoForm onSubmit={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}
```

## Implementation Tips

### 1. State Management
- Keep state at the highest necessary level
- Use `useState` for simple state
- Consider custom hooks for complex state logic

### 2. Performance Optimization
- Memoize callbacks with `useCallback`
- Memoize components with `memo`
- Use `useMemo` for expensive calculations

### 3. Event Handlers
- Define handlers with `useCallback`
- Pass handlers down as props
- Keep handler logic simple and focused

### 4. Props
- Pass minimal necessary props
- Use proper prop naming (onEvent for handlers)
- Destructure props for clarity

## Testing Implementation

### 1. Component Testing
```jsx
import { render, fireEvent } from '@testing-library/react'

test('TodoForm submits new todo', () => {
  const onSubmit = jest.fn()
  const { getByPlaceholderText, getByText } = render(
    <TodoForm onSubmit={onSubmit} />
  )

  const input = getByPlaceholderText('What needs to be done?')
  fireEvent.change(input, { target: { value: 'New Todo' } })
  fireEvent.click(getByText('Add Todo'))

  expect(onSubmit).toHaveBeenCalledWith('New Todo')
})
```

### 2. Hook Testing
```jsx
import { renderHook, act } from '@testing-library/react-hooks'

test('useLocalTodos manages todos', () => {
  const { result } = renderHook(() => useLocalTodos())

  act(() => {
    result.current.addTodo('Test Todo')
  })

  expect(result.current.todos).toHaveLength(1)
  expect(result.current.todos[0].title).toBe('Test Todo')
})
```

## Debugging Tips

### 1. Component Re-renders
```jsx
useEffect(() => {
  console.log('TodoList rendered with todos:', todos)
}, [todos])
```

### 2. State Updates
```jsx
useEffect(() => {
  console.log('Todo added/removed. Current todos:', todos)
}, [todos.length])
```

### 3. Performance Issues
```jsx
// Add to component to track re-renders
console.log('TodoItem rendered:', todo.title)
```

## Common Issues and Solutions

### 1. Infinite Loops
```jsx
// ❌ Bad - Causes infinite loop
useEffect(() => {
  setTodos([...todos, newTodo])
}, [todos])

// ✅ Good - Uses functional update
useEffect(() => {
  setTodos(prev => [...prev, newTodo])
}, [newTodo])
```

### 2. Stale Closures
```jsx
// ❌ Bad - Uses stale todos
const deleteTodo = useCallback((id) => {
  const filtered = todos.filter(todo => todo.id !== id)
  setTodos(filtered)
}, []) // Missing todos dependency

// ✅ Good - Uses functional update
const deleteTodo = useCallback((id) => {
  setTodos(prev => prev.filter(todo => todo.id !== id))
}, []) // No dependencies needed
```

## Hooks Best Practices

### 1. Rules of Hooks
- Only call hooks at the top level
- Only call hooks from React functions
- Use the exhaustive-deps ESLint rule

### 2. Dependencies
```jsx
// ❌ Bad - missing dependency
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, []) // Missing firstName, lastName

// ✅ Good - all dependencies included
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])
```

### 3. State Updates
```jsx
// ❌ Bad - multiple state updates
setCount(count + 1)
setCount(count + 1)

// ✅ Good - functional update
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

### 4. Effect Cleanup
```jsx
// ✅ Good - cleanup pattern
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  
  return () => clearInterval(timer)
}, [])
```

## Debugging Hooks

### 1. Common Issues
- Infinite re-renders
- Stale closures
- Missing dependencies
- Unnecessary re-renders

### 2. Debugging Techniques
```jsx
// Debug re-renders
useEffect(() => {
  console.log('Component rendered with:', value)
}, [value])

// Debug state updates
const [count, setCount] = useState(0)
console.log('Current count:', count)

// Debug effect dependencies
useEffect(() => {
  console.log('Dependencies changed:', dep1, dep2)
}, [dep1, dep2])
