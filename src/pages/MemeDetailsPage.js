import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Heart, Share2, MessageCircle, Send } from "lucide-react";

function MemeDetailsPage() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [meme, setMeme] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // Fetch meme details from API
  useEffect(() => {
    const fetchMemeDetails = async () => {
      try {
        const response = await axios.get("https://api.imgflip.com/get_memes");
        const foundMeme = response.data.data.memes.find((m) => m.id === id);
        if (foundMeme) setMeme(foundMeme);
      } catch (error) {
        console.error("Error fetching meme:", error);
      }
    };
    fetchMemeDetails();
  }, [id]);

  // Load likes & comments from local storage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`likes_${id}`);
    if (savedLikes) setLikes(Number.parseInt(savedLikes, 10));

    const savedComments = localStorage.getItem(`comments_${id}`);
    if (savedComments) setComments(JSON.parse(savedComments));

    const savedIsLiked = localStorage.getItem(`isLiked_${id}`);
    if (savedIsLiked) setIsLiked(JSON.parse(savedIsLiked));
  }, [id]);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : Math.max(0, likes - 1);
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
  
    // Retrieve liked memes from local storage
    let likedMemes = JSON.parse(localStorage.getItem("likedMemes")) || [];
  
    if (newIsLiked) {
      // Add meme to liked list with likes count
      const updatedMemes = likedMemes.filter(m => m.id !== id);
      updatedMemes.push({ id, name: meme.name, url: meme.url, likes: newLikes });
      localStorage.setItem("likedMemes", JSON.stringify(updatedMemes));
    } else {
      // Remove meme if unliked
      likedMemes = likedMemes.filter(m => m.id !== id);
      localStorage.setItem("likedMemes", JSON.stringify(likedMemes));
    }
  
    // Update local storage
    localStorage.setItem(`likes_${id}`, newLikes);
    localStorage.setItem(`isLiked_${id}`, JSON.stringify(newIsLiked));
  
    // Notify other pages to refresh leaderboard
    window.dispatchEvent(new Event("storage"));
  };
  
  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const username = localStorage.getItem("username") || "Anonymous"; // Get username from storage
      const updatedComments = [...comments, { id: Date.now(), text: newComment, username }];
  
      setComments(updatedComments);
      localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
      setNewComment("");
    }
  };
  

  // Share meme link
  const handleShare = async () => {
    const memeUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this meme!",
          text: "Found this cool meme, take a look!",
          url: memeUrl,
        });
      } catch (error) {
        console.error("Error sharing meme:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(memeUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (!meme) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-3xl mx-auto p-4">
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {meme.name}
        </motion.h1>

        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <img
            src={meme.url || "/placeholder.svg"}
            alt={meme.name}
            className="max-w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: "60vh" }}
          />
        </motion.div>

        {/* Like, Share, and Comment Counts */}
        <div className="flex justify-between items-center mb-6 px-4 py-3 bg-opacity-50 rounded-lg backdrop-blur-sm">
          <motion.button
            onClick={handleLike}
            className={`flex items-center gap-2 ${isLiked ? "text-red-500" : darkMode ? "text-gray-300" : "text-gray-600"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-6 h-6" />
            <span>Share</span>
          </motion.button>

          <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            <MessageCircle className="w-6 h-6" />
            <span>{comments.length}</span>
          </div>
        </div>

        {/* Comments Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`flex-grow p-2 rounded-full ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} border ${darkMode ? "border-gray-700" : "border-gray-300"}`}
              placeholder="Add a comment..."
            />
            <motion.button
              type="submit"
              className={`p-2 rounded-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>

          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg mb-2 shadow`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                <p className="font-semibold mb-1">{comment.username}</p>
                <p>{comment.text}</p>
              </motion.div>
            ))
          ) : (
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No comments yet. Be the first to comment!</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default MemeDetailsPage;
