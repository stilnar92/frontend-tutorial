import TodoList from '@features/todo-list/ui/TodoList/TodoList'
import TodoForm from '@features/todo-create/ui/TodoForm/TodoForm'

const TodoApp = () => {
  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Todo App</h1>
      
      <div className='space-y-8'>
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Add New Todo</h2>
          <TodoForm onSubmit={(todo) => console.log('Add todo:', todo)} />
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Todo List</h2>
          <TodoList
            todos={[]}
            onToggle={(id) => console.log('Toggle todo:', id)}
            onDelete={(id) => console.log('Delete todo:', id)}
          />
        </div>
      </div>
    </div>
  )
}

export default TodoApp
