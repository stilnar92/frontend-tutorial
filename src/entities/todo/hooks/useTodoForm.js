import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema } from '../model/schema'
import { todoApi } from '../api/todoApi'
import { useKeyPress } from '@shared/lib/hooks/useKeyPress'

export const useTodoForm = ({ onSuccess } = {}) => {
  const {
    register,
    handleSubmit,
    reset,
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
      console.error('Failed to create todo:', error)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  }
}
