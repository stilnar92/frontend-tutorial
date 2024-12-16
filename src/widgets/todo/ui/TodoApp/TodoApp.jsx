import TodoList from '@features/todo-list/ui/TodoList/TodoList'
import TodoForm from '@features/todo-create/ui/TodoForm/TodoForm'
import { useTodos } from '@entities/todo/model/hooks/useTodos'
import { useKeyPress } from '@shared/lib/hooks/useKeyPress'

const TodoApp = () => {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
  } = useTodos()

  // Clear completed todos with Alt+C
  useKeyPress('c', (e) => {
    if (e.altKey) {
      clearCompleted()
    }
  })

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo App</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>
          <TodoForm onSubmit={addTodo} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Todo List</h2>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Completed (Alt+C)
            </button>
          </div>
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
      </div>
    </div>
  )
}

export default TodoApp
