import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../model/schema'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/sessionStore';

export const useLoginForm = () => {
  const navigate = useNavigate()
  const login = useSessionStore((state) => state.login);
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
      const success = await login(data);
      if (success) {
        navigate('/');
      } else {
        setError('root', {
          type: 'server',
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'server',
        message: error.message || 'Something went wrong'
      });
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  }
}
