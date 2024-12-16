import { axiosInstance } from '@shared/api/axios'
import { validateApiResponse } from '@shared/lib/validation/validateApi'
import {
  todoListSchema,
  todoItemSchema,
  createTodoSchema,
  updateTodoSchema
} from '../model/validation'

const ENDPOINTS = {
  GET_TODOS: '/todos',
  GET_TODO: (id) => `/todos/${id}`,
  CREATE_TODO: '/todos',
  UPDATE_TODO: (id) => `/todos/${id}`,
  DELETE_TODO: (id) => `/todos/${id}`
}

export const todoApi = {
  /**
   * Get all todos
   * @returns {Promise<import('zod').infer<typeof todoListSchema>>} Array of todos
   */
  async getTodos() {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODOS)
    return validateApiResponse(todoListSchema, data)
  },

  /**
   * Get todo by id
   * @param {number} id - Todo ID
   * @returns {Promise<import('zod').infer<typeof todoItemSchema>>} Todo object
   */
  async getTodoById(id) {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODO(id))
    return validateApiResponse(todoItemSchema, data)
  },

  /**
   * Create new todo
   * @param {import('zod').infer<typeof createTodoSchema>} todo - Todo object
   * @returns {Promise<import('zod').infer<typeof todoItemSchema>>} Created todo object
   */
  async createTodo(todo) {
    // Validate request data
    const validatedData = createTodoSchema.parse(todo)
    const { data } = await axiosInstance.post(ENDPOINTS.CREATE_TODO, validatedData)
    return validateApiResponse(todoItemSchema, data)
  },

  /**
   * Update todo
   * @param {number} id - Todo ID
   * @param {import('zod').infer<typeof updateTodoSchema>} todo - Todo object
   * @returns {Promise<import('zod').infer<typeof todoItemSchema>>} Updated todo object
   */
  async updateTodo(id, todo) {
    // Validate request data
    const validatedData = updateTodoSchema.parse(todo)
    const { data } = await axiosInstance.put(ENDPOINTS.UPDATE_TODO(id), validatedData)
    return validateApiResponse(todoItemSchema, data)
  },

  /**
   * Delete todo
   * @param {number} id - Todo ID
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    await axiosInstance.delete(ENDPOINTS.DELETE_TODO(id))
  }
}
