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

## React Custom Hooks Implementation Guide

This guide demonstrates the implementation of custom React hooks for a Todo application, following best practices and Feature-Sliced Design principles.

## Custom Hooks Overview

### 1. useLocalStorage Hook
A hook for persisting state in localStorage.

```javascript
const [value, setValue] = useLocalStorage('key', initialValue)
```

Key features:
- Automatic JSON serialization/deserialization
- Error handling for localStorage operations
- Type-safe value management

### 2. useTodos Hook
Manages todo state with localStorage persistence.

```javascript
const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
```

Key features:
- CRUD operations for todos
- Persistent storage
- Memoized operations

### 3. useForm Hook
Handles form state and validation.

```javascript
const { values, errors, handleChange, handleSubmit, reset } = useForm(initialValues)
```

Key features:
- Form state management
- Validation handling
- Form reset functionality

### 4. useKeyPress Hook
Manages keyboard shortcuts.

```javascript
useKeyPress('c', callback, dependencies)
```

Key features:
- Keyboard event handling
- Support for modifier keys
- Automatic cleanup

## Step-by-Step Implementation Guide

### Step 1: Create useLocalStorage Hook

1. Create `src/shared/lib/hooks/useLocalStorage.js`
2. Implement storage operations with error handling
3. Add JSON parsing/stringifying
4. Implement state synchronization

### Step 2: Create useTodos Hook

1. Create `src/entities/todo/model/hooks/useTodos.js`
2. Use useLocalStorage for persistence
3. Implement CRUD operations
4. Add memoization for performance

### Step 3: Create useForm Hook

1. Create `src/shared/lib/hooks/useForm.js`
2. Implement form state management
3. Add validation logic
4. Add reset functionality

### Step 4: Create useKeyPress Hook

1. Create `src/shared/lib/hooks/useKeyPress.js`
2. Implement keyboard event listeners
3. Add cleanup on unmount
4. Support modifier keys

### Step 5: Integrate Hooks

1. Update TodoForm to use useForm
2. Update TodoApp to use useTodos
3. Add keyboard shortcuts using useKeyPress
4. Test all functionality

## Best Practices

1. **Separation of Concerns**
   - Keep hooks focused on single responsibility
   - Follow Feature-Sliced Design principles

2. **Performance**
   - Use useCallback for handlers
   - Implement proper dependencies
   - Memoize where necessary

3. **Error Handling**
   - Handle localStorage errors
   - Validate form inputs
   - Provide meaningful error messages

4. **Type Safety**
   - Use consistent data structures
   - Validate input/output types
   - Handle edge cases

## Usage Examples

### Using useLocalStorage
```javascript
const [todos, setTodos] = useLocalStorage('todos', [])
```

### Using useTodos
```javascript
const { todos, addTodo } = useTodos()
addTodo('New Task')
```

### Using useForm
```javascript
const { values, handleSubmit } = useForm({ title: '' })
```

### Using useKeyPress
```javascript
useKeyPress('Escape', () => reset())
```

## Testing

1. Test hook initialization
2. Test state updates
3. Test error scenarios
4. Test cleanup functions

## Troubleshooting

Common issues and solutions:
- localStorage quota exceeded
- JSON parsing errors
- Event listener cleanup
- Form validation errors

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

```

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
