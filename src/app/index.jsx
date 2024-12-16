import './styles/index.css'
import TodoApp from '@widgets/todo/ui/TodoApp'

function App() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='container mx-auto px-4 py-8'>
        <TodoApp />
      </div>
    </div>
  )
}

export default App
