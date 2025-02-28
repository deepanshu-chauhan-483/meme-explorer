import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function LeaderboardPage() {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const { darkMode } = useTheme();

  const fetchTopMemes = () => {
    let likedMemes = JSON.parse(localStorage.getItem("likedMemes")) || [];
    likedMemes.sort((a, b) => b.likes - a.likes);
    setTopMemes(likedMemes.slice(0, 10));
  };

  const fetchTopUsers = () => {
    let users = JSON.parse(localStorage.getItem("topUsers")) || [];
  
    // If no users exist, add dummy users
    if (users.length === 0) {
      users = [
        { id: 1, name: "User1", score: 120 },
        { id: 2, name: "User2", score: 100 },
        { id: 3, name: "User3", score: 90 },
        { id: 4, name: "User4", score: 80 },
        { id: 5, name: "User5", score: 70 },
        
      ];
      localStorage.setItem("topUsers", JSON.stringify(users));
    }
  
    users.sort((a, b) => b.score - a.score);
    setTopUsers(users.slice(0, 10));
  };
  

  useEffect(() => {
    fetchTopMemes();
    fetchTopUsers();

    const handleStorageChange = (event) => {
      if (event.key === "likedMemes") fetchTopMemes();
      if (event.key === "topUsers") fetchTopUsers();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className={`h-auto mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Top Memes */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Top 10 Memes</h2>
          <ul className={`shadow rounded-lg divide-y ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            {topMemes.map((meme, index) => (
              <li key={meme.id} className="p-4 flex justify-between items-center">
                <span>{index + 1}. {meme.name}</span>
                <span>{meme.likes} likes</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Users */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Top 10 Users</h2>
          <ul className={`shadow rounded-lg divide-y ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            {topUsers.map((user, index) => (
              <li key={user.id} className="p-4 flex justify-between items-center">
                <span>{index + 1}. {user.name}</span>
                <span>{user.score} points</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
