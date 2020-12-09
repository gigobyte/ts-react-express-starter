import { useSession } from '../session'

export const Home = () => {
  const { user, logout } = useSession()

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <div className="text-xl font-medium text-black">ChitChat</div>
        <p className="text-gray-500">You have a new message!</p>
        {user ? JSON.stringify(user) : 'not logged in'}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
