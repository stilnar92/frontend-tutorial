import { z } from 'zod'

// Base todo schema for shared fields
const todoBase = {
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(10000, 'Title must be less than 50 characters'),
  completed: z.boolean().default(false)
}

// Schema for individual todo items from API
export const todoItemSchema = z.object({
  ...todoBase,
  id: z.number(),
  userId: z.number().optional(),
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
