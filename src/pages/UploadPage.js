"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

function UploadPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("https://api.memegen.link/templates");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const memePreviewUrl = selectedTemplate
    ? `https://api.memegen.link/images/${selectedTemplate}/${topText || "_"}/${bottomText || "_"}.png`
    : "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!image && !memePreviewUrl) {
      alert("Please select an image or create a meme first.");
      return;
    }
  
    setUploading(true);
  
    try {
      let base64Data;
  
      if (image) {
        // If uploading a custom image from the device
        base64Data = image.split(",")[1];
      } else if (memePreviewUrl) {
        console.log("Fetching meme image from:", memePreviewUrl);
  
        // Fetch the image from the meme URL
        const response = await fetch(memePreviewUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
  
        const blob = await response.blob();
        console.log("Image fetched successfully. Converting to base64...");
  
        // Convert blob to base64
        base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = () => reject(new Error("Failed to convert image to base64."));
          reader.readAsDataURL(blob);
        });
  
        console.log("Image converted to base64 successfully.");
      }
  
      console.log("Uploading image to ImgBB...");
  
      const API_KEY = "a897415fa1043b5ee4cfb71e92ad2d48"; // Replace with your actual ImgBB API Key
      const formData = new URLSearchParams();
      formData.append("key", API_KEY);
      formData.append("image", base64Data);
  
      // Upload image directly to ImgBB
      const uploadResponse = await axios.post("https://api.imgbb.com/1/upload", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      if (uploadResponse.data.success) {
        console.log("Upload successful. URL:", uploadResponse.data.data.url);
        setUploadedUrl(uploadResponse.data.data.url);
      } else {
        console.error("Upload failed:", uploadResponse.data.error.message);
        alert("Image upload failed: " + uploadResponse.data.error.message);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading image. Please try again.");
    }
  
    setUploading(false);
  };
  

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 w-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create or Upload a Meme
      </motion.h1>

      <motion.div
        className={`max-w-md w-full p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            onClick={() => setIsCreatingCustom(false)}
            className={`py-2 px-4 rounded font-semibold ${
              !isCreatingCustom
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Use Template
          </motion.button>
          <motion.button
            onClick={() => setIsCreatingCustom(true)}
            className={`py-2 px-4 rounded font-semibold ${
              isCreatingCustom
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Custom
          </motion.button>
        </div>

        <form onSubmit={handleUpload}>
          {!isCreatingCustom ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Create a Meme</h2>
              <label className="block mb-2 font-semibold">Choose a Meme Template:</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
                }`}
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <label className="block mb-2 font-semibold">Top Text:</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
                  }`}
                  placeholder="Enter top text..."
                />
              </div>

              <div className="mt-4">
                <label className="block mb-2 font-semibold">Bottom Text:</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
                  }`}
                  placeholder="Enter bottom text..."
                />
              </div>
            </div>
          ) : (
            <div className="mb-6" onDrop={handleDrop} onDragOver={handleDragOver}>
              <h2 className="text-lg font-semibold mb-2">Create Custom Meme</h2>
              <div
                className={`border-2 border-dashed ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                } rounded-lg p-4 text-center cursor-pointer`}
              >
                <label htmlFor="image" className="block mb-2 font-semibold">
                  Choose an Image or Drag & Drop:
                </label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-8 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}
                >
                  <p>Click to select or drag an image here</p>
                </motion.div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="caption" className="block mb-2 font-semibold">
              Caption (Optional):
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
              }`}
              rows="3"
              placeholder="Write a witty caption..."
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className={`w-full py-2 px-4 rounded font-semibold ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Meme"}
          </motion.button>
        </form>
      </motion.div>

      {memePreviewUrl && !isCreatingCustom && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold">Generated Meme Preview:</p>
          <img
            src={memePreviewUrl || "/placeholder.svg"}
            alt="Meme Preview"
            className="mt-4 max-w-full rounded-lg shadow-md"
          />
        </motion.div>
      )}

      {image && isCreatingCustom && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold">Custom Image Preview:</p>
          <img
            src={image || "/placeholder.svg"}
            alt="Custom Preview"
            className="mt-4 max-w-full rounded-lg shadow-md"
          />
        </motion.div>
      )}

      {uploadedUrl && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold">Upload Successful!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            View Meme
          </a>
        </motion.div>
      )}
    </div>
  );
}

export default UploadPage;