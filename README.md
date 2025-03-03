# MemeVerse

MemeVerse is a multi-page, highly interactive website where users can explore, upload, and interact with memes. This project showcases advanced frontend development skills, including UI/UX design, animations, state management, performance optimization, API handling, and React best practices.

Live: https://meme-explorer.vercel.app/

## 🚀 Features & Functionalities

### 📌 Homepage (Landing Page)
- Displays trending memes dynamically (fetched from an API)
- Interactive animations & transitions
- Dark mode toggle

### 📌 Meme Explorer Page
- Infinite scrolling or pagination
- Meme category filters (Trending, New, Classic, Random)
- Search functionality with debounced API calls
- Sort memes by likes, date, or comments

### 📌 Meme Upload Page
- Upload memes (image/gif format)
- Add funny captions using a text editor
- AI-based meme caption generator (using a meme-related API)
- Meme preview before uploading

### 📌 Meme Details Page
- Dynamic routing (`/meme/:id`)
- Display meme details, likes, comments, and sharing options
- Comment system (local storage for now)
- Like button with animation and local storage persistence

### 📌 User Profile Page
- Shows user-uploaded memes
- Edit profile info (Name, Bio, Profile Picture)
- View liked memes (saved in local storage or API)

### 📌 Leaderboard Page
- Top 10 most liked memes
- User rankings based on engagement

### 📌 404 Page (Easter Egg)
- A fun, meme-based 404 error page when users visit a non-existent route

## 🛠 Tech Stack
- **Next.js/React** - For page routing and component-based architecture
- **Tailwind CSS** - For styling
- **Framer Motion / GSAP** - For animations and smooth transitions
- **Redux Toolkit / Context API** - For state management
- **Local Storage / IndexedDB** - For caching data
- **Meme APIs** - For fetching memes dynamically
- **Cloudinary / Firebase** - For image uploads and storage
- **Lighthouse / React Profiler** - For performance optimization

## 📡 Free APIs Used
### Meme APIs
- **Imgflip API** - Generate and fetch popular memes [(Docs)](https://imgflip.com/api)
- **Meme Generator API** - Create memes dynamically [(Docs)](https://memegenerator.net/)

### Image Upload & Storage APIs
- **ImgBB API** - Free image hosting for meme uploads [(Docs)](https://api.imgbb.com/)

## 🏆 Skills Demonstrated
✅ **UI/UX Design** - Aesthetically pleasing and user-friendly layout  
✅ **Animations** - Smooth transitions, page loads, and UI feedback  
✅ **State Management** - Efficient use of Redux Toolkit or Context API  
✅ **API Handling** - Efficient API calls with caching and loading states  
✅ **Performance Optimization** - Lighthouse audits and React Profiler improvements  

## 📌 Getting Started
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/deepanshu-chauhan-483/meme-explorer.git
cd meme-explorer
```

### 2️⃣ Install Dependencies
```bash
yarn install
# or
npm install
```

### 3️⃣ Start the Development Server
```bash
yarn dev
# or
npm run dev
```

### 4️⃣ Build for Production
```bash
yarn build
# or
npm run build
```

## 🤝 Contributing
We welcome contributions! Feel free to open an issue or submit a pull request.

## 📜 License
This project is licensed under the MIT License.

---
🎉 **Enjoy creating and sharing memes with Meme-Explorer!** 🎉

