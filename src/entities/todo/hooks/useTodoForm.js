import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema } from '../model/schema'
import { useKeyPress } from '@shared/lib/hooks/useKeyPress'
import { useTodoStore } from '../store/todoStore'

export const useTodoForm = () => {
  const addTodo = useTodoStore((state) => state.addTodo);
  
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
      const success = await addTodo(data);
      if (success) {
        reset();
      }
    } catch (error) {
      setError('root', {
        type: 'server',
        message: error.message || 'Failed to create todo'
      })
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting
  }
}
