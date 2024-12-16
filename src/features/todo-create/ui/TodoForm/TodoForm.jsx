import { useState, useCallback } from 'react'

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit(title)
    setTitle('')
  }, [title, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  )
}

export default TodoForm
