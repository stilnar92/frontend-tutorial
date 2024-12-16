# React Router Guide

## What is React Router?

React Router is a client-side routing library for React applications. It allows you to create single-page applications with dynamic, client-side routing.

## Core Concepts

1. **BrowserRouter**: Uses HTML5 history API to keep UI in sync with URL
2. **Routes**: Defines route configuration and mapping
3. **Route**: Individual route definitions
4. **Link**: Navigation without page reload
5. **Outlet**: Renders child routes

## Step-by-Step Implementation

### 1. Installation

```bash
npm install react-router-dom
```

### 2. Basic Setup

```javascript
// src/app/router/index.jsx
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  }
])

// src/app/index.jsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export const App = () => {
  return <RouterProvider router={router} />
}
```

### 3. Creating Pages

```javascript
// src/pages/home/ui/HomePage.jsx
export const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our app!</p>
    </div>
  )
}

// src/pages/about/ui/AboutPage.jsx
export const AboutPage = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about us</p>
    </div>
  )
}
```

### 4. Adding Multiple Routes

```javascript
// src/app/router/index.jsx
import { HomePage, AboutPage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/about',
    element: <AboutPage />
  }
])
```

### 5. Creating Layout

```javascript
// src/widgets/layouts/RootLayout.jsx
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <div>
      <header>
        <nav>{/* Navigation links */}</nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  )
}
```

### 6. Implementing Navigation

```javascript
// src/widgets/layouts/Header.jsx
import { Link, NavLink } from 'react-router-dom'

export const Header = () => {
  return (
    <nav>
      <NavLink 
        to="/"
        className={({ isActive }) => 
          isActive ? 'text-blue-500' : ''
        }
      >
        Home
      </NavLink>
      <NavLink 
        to="/about"
        className={({ isActive }) => 
          isActive ? 'text-blue-500' : ''
        }
      >
        About
      </NavLink>
    </nav>
  )
}
```

## Common Use Cases

### 1. Dynamic Routes

```javascript
// Router configuration
{
  path: '/todo/:id',
  element: <TodoPage />
}

// TodoPage component
import { useParams } from 'react-router-dom'

export const TodoPage = () => {
  const { id } = useParams()
  return <div>Todo ID: {id}</div>
}
```

### 2. Programmatic Navigation

```javascript
import { useNavigate } from 'react-router-dom'

export const TodoForm = () => {
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    await saveTodo(data)
    navigate('/todos')
  }

  return <form onSubmit={onSubmit}>...</form>
}
```

### 3. Query Parameters

```javascript
import { useSearchParams } from 'react-router-dom'

export const TodoList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  return (
    <select 
      value={filter}
      onChange={e => setSearchParams({ filter: e.target.value })}
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
    </select>
  )
}
```

### 4. Protected Routes

```javascript
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth() // Your auth hook
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return children
}

// Usage in router
{
  path: '/profile',
  element: (
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  )
}
```

## Best Practices

1. **Route Organization**
   ```javascript
   const router = createBrowserRouter([
     {
       element: <RootLayout />,
       errorElement: <ErrorPage />,
       children: [
         {
           path: '/',
           element: <HomePage />
         },
         {
           path: '/about',
           element: <AboutPage />
         }
       ]
     }
   ])
   ```

2. **Lazy Loading**
   ```javascript
   import { lazy } from 'react'
   
   const AboutPage = lazy(() => import('./pages/AboutPage'))
   
   // In router
   {
     path: '/about',
     element: (
       <Suspense fallback={<Loading />}>
         <AboutPage />
       </Suspense>
     )
   }
   ```

3. **Error Handling**
   ```javascript
   const ErrorPage = () => {
     const error = useRouteError()
     return (
       <div>
         <h1>Oops!</h1>
         <p>{error.message}</p>
       </div>
     )
   }
   ```

## Common Hooks

1. `useNavigate()`: Programmatic navigation
2. `useParams()`: Access URL parameters
3. `useSearchParams()`: Handle query parameters
4. `useLocation()`: Access current location
5. `useRouteError()`: Access route errors

## Tips

1. Always use `Link` or `NavLink` for navigation
2. Implement proper error boundaries
3. Use lazy loading for better performance
4. Keep route configurations clean and organized
5. Use descriptive route names

## Resources

- [React Router Documentation](https://reactrouter.com)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [React Router GitHub](https://github.com/remix-run/react-router)
