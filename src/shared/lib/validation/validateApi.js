import { ZodError } from 'zod'
import { apiErrorSchema } from '@entities/todo/model/validation'

export class ValidationError extends Error {
  constructor(message, errors) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

/**
 * Validates API response data against a schema
 * @template T
 * @param {import('zod').ZodType<T>} schema - Zod schema to validate against
 * @param {unknown} data - Data to validate
 * @returns {T} Validated data
 * @throws {ValidationError} If validation fails
 */
export const validateApiResponse = (schema, data) => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation failed:', error.errors)
      throw new ValidationError('API response validation failed', error.errors)
    }
    throw error
  }
}

/**
 * Validates API error response
 * @param {unknown} error - Error response from API
 * @returns {import('zod').infer<typeof apiErrorSchema>} Validated error
 */
export const validateApiError = (error) => {
  try {
    return apiErrorSchema.parse(error)
  } catch (validationError) {
    console.error('Error response validation failed:', validationError)
    return {
      message: 'An unexpected error occurred',
      code: 500
    }
  }
}
