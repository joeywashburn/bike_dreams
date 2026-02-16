import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">The Garage</h1>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">Bike Build Configurator</span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {currentUser && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">{currentUser.email}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
