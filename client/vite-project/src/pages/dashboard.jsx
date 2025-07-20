import { useEffect, useState } from 'react'
import { toggleTheme } from '../utils/theme'

const Dashboard = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const handleToggle = () => {
    toggleTheme();
    setIsDark(document.documentElement.classList.contains('dark'));
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center 
                     bg-white text-black 
                     dark:bg-black dark:text-white transition-colors duration-300`}>

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <p className="text-red-500 dark:text-green-500 mb-6">
        Text should turn green in dark mode.
      </p>

      <button
        onClick={handleToggle}
        className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default Dashboard;
