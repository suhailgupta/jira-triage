import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function Header() {
    const { theme, setTheme } = useContext(ThemeContext)

    return (
        <header className="sticky top-0 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-bold">🚀 Jira RCA</h1>
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    )
}