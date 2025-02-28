"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { debounce } from "lodash";
import { Search, Heart, MessageCircle, TrendingUpIcon as Trending, Clock, Star, Shuffle } from "lucide-react";

function ExplorerPage() {
  const { darkMode } = useTheme();

  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [category, setCategory] = useState("Trending");
  const [page, setPage] = useState(1);
  const observer = useRef();

  const categories = [
    { name: "Trending", icon: <Trending className="w-5 h-5" /> },
    { name: "New", icon: <Clock className="w-5 h-5" /> },
    { name: "Classic", icon: <Star className="w-5 h-5" /> },
    { name: "Random", icon: <Shuffle className="w-5 h-5" /> },
  ];

  // Fetch Memes
  const fetchMemes = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.imgflip.com/get_memes`);
      const newMemes = response.data.data.memes.map((meme) => {
        const storedLikes = localStorage.getItem(`likes_${meme.id}`);
        const storedComments = JSON.parse(localStorage.getItem(`comments_${meme.id}`)) || [];
        const isLiked = localStorage.getItem(`isLiked_${meme.id}`) === "true";

        return {
          ...meme,
          likes: storedLikes ? parseInt(storedLikes) : 0,
          comments: storedComments.length,
          isLiked,
          date: Date.now() - Math.floor(Math.random() * 1e9),
        };
      });

      setMemes((prev) => (pageNum === 1 ? newMemes : [...prev, ...newMemes]));
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMemes(page);
  }, [fetchMemes, page]);

  // Handle Like
  const handleLike = (memeId, event) => {
    event.preventDefault();

    setMemes((prevMemes) =>
      prevMemes.map((meme) =>
        meme.id === memeId
          ? {
              ...meme,
              likes: meme.isLiked ? meme.likes - 1 : meme.likes + 1,
              isLiked: !meme.isLiked,
            }
          : meme
      )
    );

    // Update Local Storage
    const isLiked = localStorage.getItem(`isLiked_${memeId}`) === "true";
    localStorage.setItem(`isLiked_${memeId}`, JSON.stringify(!isLiked));

    const currentLikes = Number.parseInt(localStorage.getItem(`likes_${memeId}`)) || 0;
    localStorage.setItem(`likes_${memeId}`, JSON.stringify(isLiked ? currentLikes - 1 : currentLikes + 1));
  };

  // Debounced Search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setFilteredMemes(
        !query ? memes : memes.filter((meme) => meme.name.toLowerCase().includes(query.toLowerCase()))
      );
    }, 300),
    [memes]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Category Filtering
  useEffect(() => {
    let filtered = memes;
    if (category === "Trending") {
      filtered = [...memes].sort((a, b) => b.likes - a.likes).slice(0, 20);
    } else if (category === "New") {
      filtered = [...memes].sort((a, b) => b.date - a.date).slice(0, 20);
    } else if (category === "Classic") {
      filtered = memes.filter((_, i) => i % 2 === 0);
    } else if (category === "Random") {
      filtered = memes.sort(() => 0.5 - Math.random()).slice(0, 20);
    }

    setFilteredMemes(filtered);
  }, [category, memes]);

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
      <motion.h1 className="text-4xl font-bold mb-8 text-center">Meme Explorer</motion.h1>

      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search memes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 pl-10 border rounded-lg ${
            darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Categories */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={`px-4 py-2 rounded-lg ${
              category === cat.name
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMemes.map((meme) => (
          <motion.div key={meme.id} className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={{ scale: 1.03 }}>
            <Link to={`/meme/${meme.id}`}>
              <img src={meme.url} alt={meme.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{meme.name}</h3>
              <button onClick={(e) => handleLike(meme.id, e)} className={`flex items-center ${meme.isLiked ? "text-red-500" : "text-gray-500"}`}>
                <Heart className="w-5 h-5" />
                <span className="ml-1">{meme.likes}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ExplorerPage;
