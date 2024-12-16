import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../model/schema'
import { sessionApi } from '../api/sessionApi'
import { useNavigate } from 'react-router-dom'

export const useLoginForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      await sessionApi.login(data)
      navigate('/')
    } catch (error) {
      setError('root', {
        type: 'server',
        message: error.message
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
