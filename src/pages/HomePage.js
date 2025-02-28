import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

function HomePage() {
  const [trendingMemes, setTrendingMemes] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchTrendingMemes = async () => {
      try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        setTrendingMemes(response.data.data.memes.slice(0, 10));
      } catch (error) {
        console.error('Error fetching trending memes:', error);
      }
    };

    fetchTrendingMemes();
  }, []);

  return (
    <div className={`min-h-screen mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Meme Explorer
      </motion.h1>
      
      <motion.h2
        className="text-2xl font-semibold mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Trending Memes
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingMemes.map((meme, index) => (
          <motion.div
            key={meme.id}
            className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={`/meme/${meme.id}`}>
              <img src={meme.url || "/placeholder.svg"} alt={meme.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{meme.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {trendingMemes.length === 0 && (
        <motion.p
          className="text-center mt-4 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No trending memes found.
        </motion.p>
      )}
    </div>
  );
}

export default HomePage;
