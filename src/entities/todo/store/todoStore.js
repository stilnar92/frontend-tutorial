import { create } from 'zustand';
import { todoApi } from '../api/todoApi';

export const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  // Fetch all todos
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todoApi.getTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Add new todo
  addTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await todoApi.createTodo(todo);
      set((state) => ({
        todos: [...state.todos, newTodo],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Toggle todo status
  toggleTodo: async (id) => {
    try {
      const todo = get().todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await todoApi.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      });

      set((state) => ({
        todos: state.todos.map(t => 
          t.id === id ? updatedTodo : t
        )
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      await todoApi.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter(t => t.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));
