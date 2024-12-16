import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        newErrors[key] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values)
      setValues(initialValues) // Reset form after successful submission
    } else {
      setErrors(newErrors)
    }
  }, [values, initialValues])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset
  }
}
