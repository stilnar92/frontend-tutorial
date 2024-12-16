# API Setup Guide with Feature-Sliced Design (FSD)

This guide explains how to set up API integration following FSD architecture principles.

## Prerequisites

- Node.js and npm installed
- React project with FSD structure

## Step 1: Install Dependencies

```bash
# Install Axios for making HTTP requests
npm install axios
```

## Step 2: Create Project Structure

Create the following directory structure:
```
src/
├── shared/
│   └── api/
│       └── axios.js           # Shared API configuration
└── entities/
    └── todo/
        ├── api/
        │   └── todoApi.js     # Todo API methods
        ├── model/
        │   ├── types.js       # Todo types
        │   └── constants.js   # Todo constants
        └── index.js           # Public API
```

## Step 3: Configure Base API

Create shared API configuration in `src/shared/api/axios.js`:
```javascript
import axios from 'axios'

export const BASE_URL = 'https://jsonplaceholder.typicode.com'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## Step 4: Define Entity Types

Create types in `src/entities/todo/model/types.js`:
```javascript
/**
 * @typedef {Object} Todo
 * @property {number} id - Todo ID
 * @property {string} title - Todo title
 * @property {boolean} completed - Todo completion status
 * @property {number} userId - User ID
 */

/**
 * @typedef {Object} CreateTodoDTO
 * @property {string} title - Todo title
 * @property {boolean} completed - Todo completion status
 */

/**
 * @typedef {Object} UpdateTodoDTO
 * @property {string} [title] - Todo title
 * @property {boolean} [completed] - Todo completion status
 */
```

## Step 5: Define Error Constants

Create constants in `src/entities/todo/model/constants.js`:
```javascript
export const TODO_ERRORS = {
  FETCH_ERROR: 'Failed to fetch todos',
  CREATE_ERROR: 'Failed to create todo',
  UPDATE_ERROR: 'Failed to update todo',
  DELETE_ERROR: 'Failed to delete todo',
}
```

## Step 6: Implement API Methods

Create API methods in `src/entities/todo/api/todoApi.js`:
```javascript
import { axiosInstance } from '@shared/api/axios'

const ENDPOINTS = {
  GET_TODOS: '/todos',
  GET_TODO: (id) => `/todos/${id}`,
  CREATE_TODO: '/todos',
  UPDATE_TODO: (id) => `/todos/${id}`,
  DELETE_TODO: (id) => `/todos/${id}`,
}

export const todoApi = {
  async getTodos() {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODOS)
    return data
  },

  async getTodoById(id) {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODO(id))
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
  },
}
```

## Step 7: Create Public API

Export entity's public API in `src/entities/todo/index.js`:
```javascript
export { todoApi } from './api/todoApi'
export { TODO_ERRORS } from './model/constants'
```

## Usage Example

```javascript
import { todoApi } from '@entities/todo'

// Fetch todos
const todos = await todoApi.getTodos()

// Create todo
const newTodo = await todoApi.createTodo({
  title: 'New Todo',
  completed: false,
})

// Update todo
const updatedTodo = await todoApi.updateTodo(1, {
  completed: true,
})

// Delete todo
await todoApi.deleteTodo(1)
```

## Best Practices

1. **API Organization**:
   - Keep base API configuration in shared layer
   - Group related API methods by entity
   - Use DTOs for request/response typing

2. **Error Handling**:
   - Define error constants
   - Handle errors consistently
   - Use descriptive error messages

3. **Code Structure**:
   - Follow FSD layer isolation
   - Keep endpoints centralized
   - Export only necessary methods
