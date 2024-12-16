import { z } from 'zod'

// Schema for a single todo item from API
export const todoItemSchema = z.object({
  id: z.number(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(50, 'Title must be less than 50 characters'),
  completed: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

// Schema for the list of todos from API
export const todoListSchema = z.array(todoItemSchema)

// Schema for creating a new todo
export const createTodoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(50, 'Title must be less than 50 characters'),
  completed: z.boolean().default(false)
})

// Schema for updating a todo
export const updateTodoSchema = createTodoSchema.partial()

// API error response schema
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.number().optional(),
  details: z.record(z.any()).optional()
})
