import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './contexts/ThemeContext'; // Ensure ThemeProvider is imported
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import UploadPage from './pages/UploadPage';
import MemeDetailsPage from './pages/MemeDetailsPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage.tsx';
import BallTrail from './components/BallTrail';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider> {/* Wrap the entire app */}
        <Router>
          <div className="App">
            <BallTrail/>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorerPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/meme/:id" element={<MemeDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
