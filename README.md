# Todo App with Zustand Integration

## Theory

### What is Zustand?

Zustand is a state management library for React that provides a minimalistic API for managing application state. Unlike traditional state management solutions like Redux, Zustand is built with simplicity and performance in mind.

### Core Concepts

#### 1. Store Creation
A store in Zustand is created using the `create` function:
```javascript
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // State
  count: 0,
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 }))
}))
```

Key concepts:
- `set`: Function to update state
- `get`: Function to access current state
- State and actions are defined in a single object

#### 2. State Updates

Zustand provides two ways to update state:

a) Direct updates:
```javascript
set({ count: 1 })
```

b) Updates based on previous state:
```javascript
set((state) => ({ count: state.count + 1 }))
```

#### 3. Async Actions

Zustand handles async operations naturally:
```javascript
const useStore = create((set) => ({
  data: null,
  fetchData: async () => {
    const response = await api.getData()
    set({ data: response })
  }
}))
```

#### 4. Selectors and Re-renders

Zustand uses selectors to optimize re-renders:
```javascript
// Will re-render only when count changes
const count = useStore((state) => state.count)

// Will re-render when any state changes
const { count } = useStore()
```

#### 5. Middleware

Zustand supports middleware for extending functionality:
```javascript
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      count: 0
    }),
    { name: 'count-storage' }
  )
)
```

### Advantages Over Other Solutions

1. **Simplicity**
   - No boilerplate code
   - No providers needed
   - Simple API with set/get

2. **Performance**
   - Minimal re-renders
   - Small bundle size
   - Fast updates

3. **Flexibility**
   - Works with class and function components
   - Supports TypeScript
   - Easy integration with existing code

4. **Developer Experience**
   - Built-in devtools support
   - Easy debugging
   - Clear error messages

### State Management Patterns

#### 1. Computed Values
```javascript
const useStore = create((set, get) => ({
  todos: [],
  completedTodos: () => get().todos.filter(t => t.completed)
}))
```

#### 2. Action Composition
```javascript
const useStore = create((set, get) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({ 
    todos: [...state.todos, todo] 
  })),
  clearCompleted: () => {
    const todos = get().todos
    set({ todos: todos.filter(t => !t.completed) })
  }
}))
```

#### 3. Error Handling
```javascript
const useStore = create((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}))
```

#### 4. Loading States
```javascript
const useStore = create((set) => ({
  isLoading: false,
  data: null,
  fetchData: async () => {
    set({ isLoading: true })
    try {
      const data = await api.getData()
      set({ data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  }
}))
```

## Project Implementation

### 1. Session Management

We implemented authentication using Zustand in `src/entities/session/store/sessionStore.js`:

```javascript
export const useSessionStore = create((set) => ({
  // State
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  isLoading: false,

  // Actions
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sessionApi.login(credentials);
      localStorage.setItem('token', response.token);
      set({ token: response.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, user: null });
  }
}));
```

Usage in components:
```javascript
// In LoginPage
const login = useSessionStore((state) => state.login);
const onSubmit = async (credentials) => {
  if (await login(credentials)) {
    navigate('/');
  }
};

// In protected routes
const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
if (!isAuthenticated) return redirect('/login');
```

### 2. Todo Management

Todo state management is implemented in `src/entities/todo/store/todoStore.js`:

```javascript
export const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  isLoading: false,
  error: null,

  // Actions
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todoApi.getTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await todoApi.createTodo(todo);
      set((state) => ({
        todos: [...state.todos, newTodo],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await todoApi.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      });
      set((state) => ({
        todos: state.todos.map(t => t.id === id ? updatedTodo : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteTodo: async (id) => {
    try {
      await todoApi.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter(t => t.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
```

Usage in components:
```javascript
// In HomePage
const todos = useTodoStore((state) => state.todos);
const fetchTodos = useTodoStore((state) => state.fetchTodos);

useEffect(() => {
  fetchTodos();
}, []);

// In TodoForm
const addTodo = useTodoStore((state) => state.addTodo);
const onSubmit = async (data) => {
  await addTodo(data);
};
```

## Key Implementation Details

### 1. State Updates
- Using `set` for direct state updates
- Using `set((state) => ...)` for updates based on previous state
- Handling async operations with try-catch blocks

### 2. Error Handling
- Each store maintains its own error state
- Errors are cleared before new operations
- Error states are accessible in components for display

### 3. Loading States
- Loading states are managed for async operations
- Components can show loading indicators based on isLoading state

### 4. Data Persistence
- Authentication token is persisted in localStorage
- Token is loaded on store initialization

### 5. API Integration
- Each store action wraps corresponding API calls
- Responses are validated before state updates
- Error states capture API errors

## Testing the Implementation

1. Authentication:
```javascript
// Login
const credentials = { email: 'user@example.com', password: 'password123' };
await useSessionStore.getState().login(credentials);

// Check auth state
const isAuthenticated = useSessionStore.getState().isAuthenticated;
```

2. Todo Operations:
```javascript
// Create todo
await useTodoStore.getState().addTodo({ title: 'New Task' });

// Toggle todo
await useTodoStore.getState().toggleTodo(1);

// Delete todo
await useTodoStore.getState().deleteTodo(1);
