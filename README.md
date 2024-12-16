# Zod API Validation Guide

## Introduction to Zod

Zod is a TypeScript-first schema declaration and validation library. It lets you create schemas that validate data at runtime while providing static type inference.

## Core Concepts

### 1. Schema Definition

Schemas are the building blocks of Zod validation. They define the shape and constraints of your data:

```typescript
import { z } from 'zod'

// Basic schema
const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  age: z.number().min(18)
})

// Nested schema
const postSchema = z.object({
  title: z.string(),
  author: userSchema,
  tags: z.array(z.string())
})
```

### 2. Data Validation

Validate data using schema methods:

```typescript
// Using .parse() - throws error on invalid data
try {
  const user = userSchema.parse(data)
} catch (error) {
  console.error(error.errors) // Validation error details
}

// Using .safeParse() - returns success/error object
const result = userSchema.safeParse(data)
if (!result.success) {
  console.error(result.error.errors)
} else {
  const validatedData = result.data
}
```

## API Validation Patterns

### 1. Request Validation

```typescript
// Request schema
const createUserRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string()
})

// API endpoint
async function createUser(req) {
  const result = createUserRequest.safeParse(req.body)
  if (!result.success) {
    return {
      status: 400,
      body: { errors: result.error.errors }
    }
  }
  
  // Proceed with validated data
  const user = await db.users.create(result.data)
}
```

### 2. Response Validation

```typescript
// Response schema
const userResponse = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.string().datetime()
})

// API response validation
async function fetchUser(id) {
  const response = await api.get(`/users/${id}`)
  return userResponse.parse(response.data)
}
```

### 3. Error Handling

```typescript
// API error schema
const apiError = z.object({
  code: z.number(),
  message: z.string(),
  details: z.record(z.any()).optional()
})

// Error handler
function handleApiError(error) {
  try {
    const parsedError = apiError.parse(error.response?.data)
    return {
      message: parsedError.message,
      code: parsedError.code
    }
  } catch {
    return {
      message: 'Unknown error occurred',
      code: 500
    }
  }
}
```

## Advanced Validation Techniques

### 1. Transformations

```typescript
const dateSchema = z.string().datetime()
  .transform(str => new Date(str))

const userWithDates = userSchema.extend({
  createdAt: dateSchema,
  updatedAt: dateSchema
})
```

### 2. Custom Validations

```typescript
const passwordSchema = z.string()
  .min(8)
  .refine(
    password => /[A-Z]/.test(password),
    'Password must contain uppercase letter'
  )
  .refine(
    password => /[0-9]/.test(password),
    'Password must contain number'
  )
```

### 3. Partial Updates

```typescript
// Original schema
const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  age: z.number()
})

// Partial schema for updates
const userUpdateSchema = userSchema.partial()
// Allows: { email?: string, name?: string, age?: number }
```

### 4. Union Types

```typescript
const responseSchema = z.union([
  z.object({ status: z.literal('success'), data: userSchema }),
  z.object({ status: z.literal('error'), error: apiError })
])
```

## Project Implementation Example

Let's look at how we implement Zod validation in our Todo application:

### 1. Todo Schemas

```typescript
// src/entities/todo/model/validation.js
import { z } from 'zod'

// Base todo schema for shared fields
const todoBase = {
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters'),
  completed: z.boolean().default(false)
}

// Schema for individual todo items from API
export const todoItemSchema = z.object({
  ...todoBase,
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// Schema for creating new todos
export const createTodoSchema = z.object({
  ...todoBase
})

// Schema for updating existing todos
export const updateTodoSchema = createTodoSchema.partial()

// Schema for API responses containing todo lists
export const todoListSchema = z.array(todoItemSchema)

// Schema for API error responses
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.number().optional(),
  details: z.record(z.any()).optional()
})
```

### 2. API Integration

```typescript
// src/shared/api/axios.js
import axios from 'axios'
import { apiErrorSchema } from '@/entities/todo/model/validation'

export const axiosInstance = axios.create({
  baseURL: '/api'
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data) {
      try {
        // Validate error response against our schema
        const validatedError = apiErrorSchema.parse(error.response.data)
        return Promise.reject(validatedError)
      } catch (validationError) {
        // If error response doesn't match our schema, return generic error
        return Promise.reject({
          message: 'An unexpected error occurred',
          code: 500
        })
      }
    }
    return Promise.reject(error)
  }
)
```

### 3. Todo API with Validation

```typescript
// src/entities/todo/api/todoApi.js
import { axiosInstance } from '@/shared/api/axios'
import {
  todoItemSchema,
  todoListSchema,
  createTodoSchema,
  updateTodoSchema
} from '../model/validation'

export const todoApi = {
  async getTodos() {
    const { data } = await axiosInstance.get('/todos')
    return todoListSchema.parse(data)
  },

  async createTodo(todo) {
    // Validate request data before sending
    const validTodo = createTodoSchema.parse(todo)
    const { data } = await axiosInstance.post('/todos', validTodo)
    return todoItemSchema.parse(data)
  },

  async updateTodo(id, todo) {
    // Validate update data, allowing partial updates
    const validTodo = updateTodoSchema.parse(todo)
    const { data } = await axiosInstance.put(`/todos/${id}`, validTodo)
    return todoItemSchema.parse(data)
  }
}
```

### 4. Form Validation with React Hook Form

```typescript
// src/entities/todo/hooks/useTodoForm.js
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTodoSchema } from '../model/validation'
import { todoApi } from '../api/todoApi'

export const useTodoForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      completed: false
    }
  })

  const onSubmit = async (data) => {
    try {
      await todoApi.createTodo(data)
      reset()
      onSuccess?.()
    } catch (error) {
      // Handle validation errors from API
      if (error.code === 400) {
        setError('root', {
          message: error.message
        })
      }
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors
  }
}
```

### 5. Using Validated Data in Components

```typescript
// src/features/todo-create/ui/TodoForm/TodoForm.jsx
import { useTodoForm } from '@/entities/todo/hooks/useTodoForm'

export const TodoForm = ({ onSuccess }) => {
  const { register, handleSubmit, errors } = useTodoForm({
    onSuccess
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        {...register('title')}
        placeholder="Enter todo title"
      />
      {errors.title && (
        <span className="error">{errors.title.message}</span>
      )}
      {errors.root && (
        <span className="error">{errors.root.message}</span>
      )}
      <button type="submit">Add Todo</button>
    </form>
  )
}
```

### Benefits in Our Project

1. **Type Safety**: 
   - All todo data is validated against defined schemas
   - TypeScript types are automatically inferred from schemas

2. **Consistent Validation**:
   - Same validation rules applied on both client and server
   - Prevents invalid data from being sent to the API

3. **Better Error Handling**:
   - Structured error messages for form validation
   - Consistent API error handling across the application

4. **Maintainable Code**:
   - Centralized validation logic in schema definitions
   - Easy to update validation rules in one place

5. **Developer Experience**:
   - Autocomplete for todo properties
   - Runtime type checking during development

## Best Practices

### 1. Schema Organization

```typescript
// Shared base schemas
const baseUser = {
  email: z.string().email(),
  name: z.string()
}

// Derived schemas
const createUserSchema = z.object({
  ...baseUser,
  password: z.string().min(8)
})

const userResponseSchema = z.object({
  ...baseUser,
  id: z.number(),
  createdAt: z.string().datetime()
})
```

### 2. Error Messages

```typescript
const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email('Invalid email format'),
  password: z.string({
    required_error: 'Password is required'
  }).min(8, 'Password must be at least 8 characters')
})
```

### 3. Type Inference

```typescript
// Infer types from schemas
type User = z.infer<typeof userSchema>
type CreateUserRequest = z.infer<typeof createUserSchema>
type ApiError = z.infer<typeof apiError>
```

## Common Patterns

### 1. Optional Fields

```typescript
const schema = z.object({
  required: z.string(),
  optional: z.string().optional(), // undefined allowed
  nullable: z.string().nullable(), // null allowed
  nullishable: z.string().nullish() // null or undefined allowed
})
```

### 2. Array Validation

```typescript
const listSchema = z.object({
  items: z.array(z.string())
    .min(1, 'List cannot be empty')
    .max(10, 'Too many items')
})
```

### 3. Enum Validation

```typescript
const UserRole = z.enum(['admin', 'user', 'guest'])
const userWithRole = userSchema.extend({
  role: UserRole
})
```

## Resources

- [Zod Documentation](https://zod.dev)
- [Zod GitHub Repository](https://github.com/colinhacks/zod)
- [TypeScript Integration](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#zod)
