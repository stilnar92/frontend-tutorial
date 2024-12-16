import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema } from '../model/schema'
import { todoApi } from '../api/todoApi'
import { useKeyPress } from '@shared/lib/hooks/useKeyPress'
import { ValidationError } from '@shared/lib/validation/validateApi'

export const useTodoForm = ({ onSuccess } = {}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      completed: false
    }
  })

  // Clear form with Escape key
  useKeyPress('Escape', reset)

  const onSubmit = async (data) => {
    try {
      await todoApi.createTodo(data)
      reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        // Set form errors from API validation
        error.errors.forEach(err => {
          setError(err.path.join('.'), {
            type: 'server',
            message: err.message
          })
        })
      } else {
        // Set generic form error
        setError('root', {
          type: 'server',
          message: error.message || 'Failed to create todo'
        })
      }
      console.error('Form submission error:', error)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  }
}
