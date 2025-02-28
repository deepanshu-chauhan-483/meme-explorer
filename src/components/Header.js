import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <nav className=" mx-auto flex justify-between items-center h-[10vh]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="text-2xl font-bold">
            Meme Explorer
          </Link>
        </motion.div>
        <ul className="flex space-x-4">
          {['explore', 'upload', 'profile', 'leaderboard'].map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/${item}`}
                className="hover:text-blue-500 transition-colors duration-200"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={toggleDarkMode}
              className="focus:outline-none"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </motion.li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;