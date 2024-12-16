import TodoItem from '@entities/todo/ui/TodoItem/TodoItem'

const TodoList = ({ todos, onToggle, onDelete }) => {
  if (!todos?.length) {
    return (
      <div className='text-center py-8 text-gray-500'>
        No todos yet. Add your first todo!
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {todos.map((todo) => (
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

export default TodoList
