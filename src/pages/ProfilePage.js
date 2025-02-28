import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Camera, Edit2, Save } from 'lucide-react';

function ProfilePage() {
  const { darkMode } = useTheme();

  const [user, setUser] = useState({
    name: localStorage.getItem("username") || "John Doe",
    bio: localStorage.getItem("bio") || "Meme enthusiast",
    profilePicture: localStorage.getItem("profilePicture") || "/placeholder.svg",
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [likedMemes, setLikedMemes] = useState([]);
  const [uploadedMemes, setUploadedMemes] = useState([]);

  useEffect(() => {
    const storedLikedMemes = JSON.parse(localStorage.getItem("likedMemes")) || [];
    setLikedMemes(storedLikedMemes);

    const storedUploadedMemes = JSON.parse(localStorage.getItem("uploadedMemes")) || [];
    setUploadedMemes(storedUploadedMemes);
  }, []);

  const handleEdit = () => setEditing(true);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("username", user.name);
    localStorage.setItem("bio", user.bio);
    localStorage.setItem("profilePicture", user.profilePicture);
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setUser((prevUser) => ({ ...prevUser, profilePicture: imageUrl }));
      localStorage.setItem("profilePicture", imageUrl);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        User Profile
      </motion.h1>

      <motion.div 
        className={`max-w-2xl mx-auto p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <motion.img 
              src={user.profilePicture || "/placeholder.svg"}
              alt={user.name}
              className="w-40 h-40 rounded-full object-cover shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            {editing && (
              <label htmlFor="image" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-grow">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold">Name:</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block mb-1 font-semibold">Bio:</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                    rows="3"
                  ></textarea>
                </div>

                <motion.button 
                  type="submit"
                  className={`py-2 px-4 rounded font-semibold flex items-center gap-2 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={uploading}
                >
                  <Save className="w-5 h-5" />
                  {uploading ? "Uploading..." : "Save"}
                </motion.button>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold">{user.name}</h2>
                <p className="text-lg">{user.bio}</p>
                <motion.button 
                  onClick={handleEdit}
                  className={`py-2 px-4 rounded font-semibold flex items-center gap-2 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Meme Sections */}
      {["Liked Memes", "Uploaded Memes"].map((section, index) => (
        <motion.div 
          key={section}
          className="max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.2, duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">{section}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(section === "Liked Memes" ? likedMemes : uploadedMemes).length > 0 ? (
              (section === "Liked Memes" ? likedMemes : uploadedMemes).map((meme) => (
                <motion.div 
                  key={meme.id}
                  className={`p-2 ${darkMode ? "bg-gray-800" : "bg-white"} shadow rounded-lg flex flex-col items-center`}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={meme.url || "/placeholder.svg"} alt={meme.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <p className="font-semibold text-center text-sm">{meme.name}</p>
                </motion.div>
              ))
            ) : (
              <p className={`col-span-full text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No {section.toLowerCase()} yet.
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ProfilePage;
