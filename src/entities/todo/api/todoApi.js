import { axiosInstance } from '@shared/api/axios'

const ENDPOINTS = {
  GET_TODOS: '/todos',
  GET_TODO: (id) => `/todos/${id}`,
  CREATE_TODO: '/todos',
  UPDATE_TODO: (id) => `/todos/${id}`,
  DELETE_TODO: (id) => `/todos/${id}`,
}

export const todoApi = {
  /**
   * Get all todos
   * @returns {Promise<Array>} Array of todos
   */
  async getTodos() {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODOS)
    return data
  },

  /**
   * Get todo by id
   * @param {number} id - Todo ID
   * @returns {Promise<Object>} Todo object
   */
  async getTodoById(id) {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_TODO(id))
    return data
  },

  /**
   * Create new todo
   * @param {Object} todo - Todo object
   * @param {string} todo.title - Todo title
   * @param {boolean} todo.completed - Todo completion status
   * @returns {Promise<Object>} Created todo object
   */
  async createTodo(todo) {
    const { data } = await axiosInstance.post(ENDPOINTS.CREATE_TODO, todo)
    return data
  },

  /**
   * Update todo
   * @param {number} id - Todo ID
   * @param {Object} todo - Todo object
   * @returns {Promise<Object>} Updated todo object
   */
  async updateTodo(id, todo) {
    const { data } = await axiosInstance.put(ENDPOINTS.UPDATE_TODO(id), todo)
    return data
  },

  /**
   * Delete todo
   * @param {number} id - Todo ID
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    await axiosInstance.delete(ENDPOINTS.DELETE_TODO(id))
  },
}
