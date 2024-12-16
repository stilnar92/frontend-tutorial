import './styles/index.css'
import TodoForm from '@features/todo-create/ui/TodoForm'
import TodoListContainer from '@features/todo-list/ui/TodoListContainer'

const App = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
      <div className="space-y-8">
        <TodoForm onSuccess={() => window.location.reload()} />
        <TodoListContainer />
      </div>
    </div>
  )
}

export default App
