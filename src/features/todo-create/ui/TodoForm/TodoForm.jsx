import { useState } from 'react'
import Button from '@shared/ui/Button/Button'

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({ title, completed: false })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='What needs to be done?'
        className='flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
      />
      <Button type='submit' disabled={!title.trim()}>
        Add Todo
      </Button>
    </form>
  )
}

export default TodoForm
