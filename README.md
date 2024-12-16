# React Hook Form Guide

## Overview

React Hook Form is a performant, flexible and extensible forms library with easy-to-use validation. It reduces the amount of code you need to write while removing unnecessary re-renders.

### Key Features

- **Performance**: Minimizes re-renders and optimizes validation
- **Easy to Use**: Simple API with hook-based approach
- **Form State**: Built-in form state management
- **Validation**: Supports both built-in and custom validation rules
- **TypeScript Support**: Full TypeScript support out of the box

## Installation

```bash
npm install react-hook-form
```

## Basic Usage

### Step 1: Simple Form Setup

```jsx
import { useForm } from 'react-hook-form'

function SimpleForm() {
  const { register, handleSubmit } = useForm()
  
  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      <input {...register('lastName')} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Step 2: Adding Validation

```jsx
function FormWithValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('firstName', {
          required: 'First name is required',
          minLength: {
            value: 2,
            message: 'Min length is 2'
          }
        })}
      />
      {errors.firstName && <span>{errors.firstName.message}</span>}
    </form>
  )
}
```

### Step 3: Form State Management

```jsx
function FormWithState() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset
  } = useForm({
    mode: 'onChange'
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      <button
        type="submit"
        disabled={!isDirty || !isValid || isSubmitting}
      >
        Submit
      </button>
      <button type="button" onClick={() => reset()}>
        Reset
      </button>
    </form>
  )
}
```

## Advanced Features

### 1. Watch Form Values

```jsx
function WatchedForm() {
  const { register, watch } = useForm()
  const watchedValue = watch('fieldName')

  return (
    <div>
      <input {...register('fieldName')} />
      <p>Current value: {watchedValue}</p>
    </div>
  )
}
```

### 2. Custom Validation

```jsx
function CustomValidationForm() {
  const { register } = useForm()

  return (
    <input
      {...register('custom', {
        validate: {
          positive: v => parseInt(v) > 0 || 'Should be positive',
          lessThanTen: v => parseInt(v) < 10 || 'Should be less than 10',
          checkUrl: async value => {
            const response = await fetch(`/api/check/${value}`)
            return response.ok || 'URL already exists'
          }
        }
      })}
    />
  )
}
```

### 3. Form Arrays

```jsx
function DynamicForm() {
  const { control } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <button type="button" onClick={() => remove(index)}>
            Delete
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '' })}>
        Add Item
      </button>
    </form>
  )
}
```

## Best Practices

1. **Default Values**
```jsx
const { register } = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
    email: ''
  }
})
```

2. **Mode Configuration**
```jsx
const { register } = useForm({
  mode: 'onChange', // validate on change
  reValidateMode: 'onBlur', // revalidate on blur
})
```

3. **Error Handling**
```jsx
const {
  formState: { errors },
  setError
} = useForm()

// Custom error setting
setError('fieldName', {
  type: 'custom',
  message: 'Custom error message'
})
```

## Real-World Example: Todo Form

```jsx
import { useForm } from 'react-hook-form'

const TodoForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0]
    }
  })

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      setError('root', {
        type: 'custom',
        message: 'Failed to create todo'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <input
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          })}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">
            {errors.title.message}
          </span>
        )}
      </div>

      <div>
        <select
          {...register('priority')}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  )
}
```

## Performance Tips

1. **Use FormProvider for Complex Forms**
```jsx
import { FormProvider, useForm } from 'react-hook-form'

function App() {
  const methods = useForm()
  return (
    <FormProvider {...methods}>
      <form>{/* form fields */}</form>
    </FormProvider>
  )
}
```

2. **Avoid Unnecessary Re-renders**
```jsx
// Good
const { register } = useForm()
<input {...register('fieldName')} />

// Bad
<input onChange={e => setValue('fieldName', e.target.value)} />
```

3. **Use Controller for Complex Inputs**
```jsx
import { Controller } from 'react-hook-form'

function App() {
  return (
    <Controller
      name="select"
      control={control}
      render={({ field }) => <Select {...field} />}
    />
  )
}
