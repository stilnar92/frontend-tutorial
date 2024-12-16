import { useEffect, useCallback } from 'react'

export const useKeyPress = (targetKey, callback, deps = []) => {
  const handleKeyPress = useCallback((event) => {
    if (event.key === targetKey) {
      callback(event)
    }
  }, [targetKey, callback])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress, ...deps])
}
