# Todo Application with Zod Validation

## What is Zod?

Zod is a TypeScript-first schema declaration and validation library. It lets you create schemas for data validation with a fluent API that's both type-safe and runtime-safe.

### Key Features of Zod

- **TypeScript-first**: Automatically infers TypeScript types from your schemas
- **Runtime validation**: Validates data at runtime, not just during compilation
- **Composable**: Build complex schemas from simple ones
- **Zero dependencies**: Lightweight and efficient
- **Rich error handling**: Detailed error messages and customizable error maps

## Getting Started

### 1. Installation

```bash
npm install zod @hookform/resolvers
```

### 2. Basic Schema Creation

```javascript
import { z } from 'zod'

// Simple string schema
const stringSchema = z.string()

// Object schema
const userSchema = z.object({
  username: z.string().min(3),
  age: z.number().min(18)
})

// Array schema
const listSchema = z.array(z.string())
```

### 3. Common Validators

```javascript
const schema = z.string()
  .min(3, 'Must be at least 3 characters')
  .max(50, 'Must be less than 50 characters')
  .email('Invalid email format')
  .url('Invalid URL')
  .regex(/pattern/, 'Custom error message')
  .transform(value => value.toLowerCase())
```

### 4. Integration with React Hook Form

```javascript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters')
})

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
    </form>
  )
}
```

## Advanced Features

### 1. Custom Error Messages

```javascript
const schema = z.object({
  password: z.string()
    .min(8, {
      message: 'Password must be at least 8 characters long'
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
})
```

### 2. Transformations

```javascript
const schema = z.string().transform(str => str.toLowerCase())
```

### 3. Optional and Nullable Fields

```javascript
const schema = z.object({
  required: z.string(),
  optional: z.string().optional(), // undefined is valid
  nullable: z.string().nullable(), // null is valid
})
```

### 4. Union Types

```javascript
const schema = z.union([
  z.string(),
  z.number()
])
```

## Best Practices

1. **Reuse Schemas**: Create base schemas and extend them for specific use cases
```javascript
const baseUserSchema = z.object({
  id: z.string(),
  email: z.string().email()
})

const fullUserSchema = baseUserSchema.extend({
  profile: z.object({
    name: z.string(),
    age: z.number()
  })
})
```

2. **Custom Refinements**: Add custom validation logic
```javascript
const schema = z.string().refine(
  (val) => val.length > 10,
  { message: 'String must be longer than 10 characters' }
)
```

3. **Error Handling**: Always handle validation errors gracefully
```javascript
try {
  const result = schema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors)
  }
}
```

## Common Gotchas

1. **Type Inference**: Remember that TypeScript types are only available during development
2. **Async Validation**: Use `.refine()` with async functions for server-side validation
3. **Performance**: Complex schemas with many refinements can impact performance
4. **Bundle Size**: Import only needed validators to keep bundle size small

## Resources

- [Zod Documentation](https://zod.dev/)
- [React Hook Form with Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [TypeScript Integration](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#zod)
