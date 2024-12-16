# Authentication Integration Guide

## Theory and Concepts

### 1. Authentication Flow
Authentication is the process of verifying a user's identity. In web applications, this typically involves:
1. User provides credentials (email/password)
2. Server validates credentials and returns a token
3. Client stores the token
4. Token is used for subsequent requests

### 2. Token-Based Authentication
- **JWT (JSON Web Token)**: A compact, URL-safe way of representing claims between parties
- **Storage**: Tokens are typically stored in localStorage or cookies
- **Usage**: Sent with each request in Authorization header

### 3. Route Protection
Different approaches to protect routes:
1. **Component-Level**: Check auth in each component
2. **Route-Level**: Use route guards/middleware
3. **API-Level**: Check token validity on server

## Implementation Guide

### 1. Session API Layer

```javascript
// src/entities/session/api/sessionApi.js
export const sessionApi = {
  // Login function
  async login({ email, password }) {
    // API call to authenticate
    const token = await authenticateUser(email, password)
    localStorage.setItem('token', token)
    return { token }
  },

  // Check authentication status
  async check() {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Unauthorized')
    return true
  },

  // Logout function
  async logout() {
    localStorage.removeItem('token')
  }
}
```

### 2. Form Validation Schema

```javascript
// src/entities/session/model/schema.js
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
})
```

### 3. Login Form Hook

```javascript
// src/entities/session/hooks/useLoginForm.js
export const useLoginForm = () => {
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    try {
      await sessionApi.login(data)
      navigate('/')
    } catch (error) {
      setError('root', {
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
```

### 4. Route Protection with Loaders

```javascript
// src/app/router/index.jsx
const authLoader = async () => {
  try {
    await sessionApi.check()
    return null
  } catch (error) {
    return redirect('/login')
  }
}

const guestLoader = async () => {
  try {
    await sessionApi.check()
    return redirect('/')
  } catch (error) {
    return null
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: authLoader  // Protected route
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: guestLoader  // Guest route
  }
])
```

## Key Features

### 1. Route Protection
- **authLoader**: Protects routes from unauthorized access
- **guestLoader**: Prevents authenticated users from accessing guest pages
- **Automatic Redirects**: Users are automatically redirected to appropriate pages

### 2. Form Handling
- **Validation**: Uses Zod for schema validation
- **Error Handling**: Proper error messages for invalid credentials
- **Loading States**: Shows loading state during form submission

### 3. Session Management
- **Token Storage**: Secure token storage in localStorage
- **API Integration**: Centralized session API
- **Logout Handling**: Clean session cleanup

## Best Practices

### 1. Security
- Store sensitive data in secure HTTP-only cookies
- Implement token refresh mechanism
- Use HTTPS for all API requests
- Sanitize user input

### 2. User Experience
- Show loading states during authentication
- Provide clear error messages
- Redirect users to intended destination
- Preserve form data on validation errors

### 3. Code Organization
- Separate authentication logic into modules
- Use typed schemas for validation
- Centralize route protection logic
- Keep components focused on presentation

## Common Patterns

### 1. Protected API Requests
```javascript
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. Error Handling
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionApi.logout()
      navigate('/login')
    }
    return Promise.reject(error)
  }
)
```

### 3. Form Submission
```javascript
const onSubmit = async (data) => {
  try {
    setSubmitting(true)
    await sessionApi.login(data)
    navigate('/')
  } catch (error) {
    handleError(error)
  } finally {
    setSubmitting(false)
  }
}
```

## Testing

### 1. Unit Tests
```javascript
describe('sessionApi', () => {
  it('should store token after login', async () => {
    await sessionApi.login({
      email: 'test@example.com',
      password: 'password'
    })
    expect(localStorage.getItem('token')).toBeTruthy()
  })
})
```

### 2. Integration Tests
```javascript
describe('Protected Route', () => {
  it('should redirect to login when unauthorized', async () => {
    localStorage.removeItem('token')
    const response = await authLoader()
    expect(response).toEqual(redirect('/login'))
  })
})
```

## Resources

- [React Router Documentation](https://reactrouter.com)
- [JWT.io](https://jwt.io)
- [Zod Documentation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
