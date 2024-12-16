// Mock user data
const MOCK_USER = {
  email: 'user@example.com',
  password: 'password123'
}

export const sessionApi = {
  // Mock login function
  async login({ email, password }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const token = 'mock-jwt-token'
      localStorage.setItem('token', token)
      return { token }
    }

    throw new Error('Invalid email or password')
  },

  // Check if user is authenticated
  async check() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Unauthorized')
    }

    return true
  },

  // Logout function
  async logout() {
    localStorage.removeItem('token')
  }
}
