# React Components Guide with FSD Architecture

This guide explains how to structure React components following Feature-Sliced Design (FSD) principles and React props best practices.

## Component Structure in FSD

FSD organizes components into layers:

1. **Entities** - Business objects (e.g., TodoItem)
2. **Features** - User interactions (e.g., TodoList, TodoForm)
3. **Widgets** - Complex components combining features (e.g., TodoApp)
4. **Pages** - Route-level components
5. **App** - Application initialization

## Component Setup Steps

### 1. Create Entity Components

Create basic business entity components in `src/entities/{entity}/ui/`:

```jsx
// src/entities/todo/ui/TodoItem/TodoItem.jsx
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  )
}
```

### 2. Create Feature Components

Create user interaction components in `src/features/{feature}/ui/`:

```jsx
// src/features/todo-list/ui/TodoList/TodoList.jsx
import TodoItem from '@entities/todo/ui/TodoItem'

const TodoList = ({ todos, onToggle, onDelete }) => {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
```

### 3. Create Widget Components

Combine features into complex widgets in `src/widgets/{widget}/ui/`:

```jsx
// src/widgets/todo/ui/TodoApp/TodoApp.jsx
import TodoList from '@features/todo-list/ui/TodoList'
import TodoForm from '@features/todo-create/ui/TodoForm'

const TodoApp = () => {
  return (
    <div>
      <TodoForm onSubmit={handleSubmit} />
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

## React Props Guide

### Types of Props

1. **Data Props**
   ```jsx
   // Passing data down
   const TodoItem = ({ todo }) => (
     <div>{todo.title}</div>
   )
   ```

2. **Action Props (Event Handlers)**
   ```jsx
   // Handling user interactions
   const TodoItem = ({ onToggle, onDelete }) => (
     <div>
       <button onClick={onToggle}>Toggle</button>
       <button onClick={onDelete}>Delete</button>
     </div>
   )
   ```

3. **Render Props**
   ```jsx
   // Customizing rendering
   const TodoList = ({ renderItem, todos }) => (
     <div>
       {todos.map(todo => renderItem(todo))}
     </div>
   )
   ```

4. **Style Props**
   ```jsx
   // Customizing appearance
   const Button = ({ variant, size, className }) => (
     <button className={buttonVariants({ variant, size, className })}>
       Click me
     </button>
   )
   ```

### Props Best Practices

1. **Props Naming**
   - Use clear, descriptive names
   - Prefix event handlers with 'on'
   - Prefix boolean props with 'is', 'has', or 'should'

   ```jsx
   // Good
   <TodoItem
     isCompleted={true}
     onToggle={handleToggle}
     onDelete={handleDelete}
   />

   // Avoid
   <TodoItem
     completed={true}
     toggle={handleToggle}
     delete={handleDelete}
   />
   ```

2. **Props Destructuring**
   ```jsx
   // Destructure props in parameters
   const TodoItem = ({ todo, onToggle, onDelete }) => {
     // Use props directly
   }

   // For many props, destructure in function body
   const ComplexComponent = (props) => {
     const {
       prop1,
       prop2,
       prop3,
       // ...more props
     } = props
   }
   ```

3. **Default Props**
   ```jsx
   // Set default values in destructuring
   const TodoItem = ({
     isCompleted = false,
     className = '',
     onToggle = () => {},
   }) => {
     // Component code
   }
   ```

4. **Props Validation**
   ```jsx
   // Document expected props with JSDoc
   /**
    * @param {Object} props
    * @param {Todo} props.todo - Todo item
    * @param {Function} props.onToggle - Toggle handler
    * @param {Function} props.onDelete - Delete handler
    */
   const TodoItem = ({ todo, onToggle, onDelete }) => {
     // Component code
   }
   ```

## Component Organization

```
src/
├── entities/
│   └── todo/
│       └── ui/
│           └── TodoItem/
│               ├── TodoItem.jsx
│               └── index.js
├── features/
│   ├── todo-list/
│   │   └── ui/
│   │       └── TodoList/
│   │           ├── TodoList.jsx
│   │           └── index.js
│   └── todo-create/
│       └── ui/
│           └── TodoForm/
│               ├── TodoForm.jsx
│               └── index.js
└── widgets/
    └── todo/
        └── ui/
            └── TodoApp/
                ├── TodoApp.jsx
                └── index.js
```

## Best Practices

1. **Component Composition**
   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Break down complex components into smaller ones

2. **Props Flow**
   - Pass only necessary props
   - Avoid prop drilling by using composition
   - Consider using context for deeply nested data

3. **Component Boundaries**
   - Keep state as close as possible to where it's used
   - Define clear interfaces between components
   - Use index files for clean exports

4. **Performance**
   - Memoize callbacks with useCallback
   - Memoize expensive computations with useMemo
   - Use React.memo for pure components
