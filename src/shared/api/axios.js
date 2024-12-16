import axios from 'axios'
import { validateApiError } from '@shared/lib/validation/validateApi'

export const BASE_URL = 'https://jsonplaceholder.typicode.com'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Validate and transform error response
    const apiError = validateApiError(error.response?.data)

    // Create a new error with the validated error details
    const enhancedError = new Error(apiError.message)
    enhancedError.code = apiError.code
    enhancedError.details = apiError.details
    enhancedError.originalError = error

    return Promise.reject(enhancedError)
  }
)
