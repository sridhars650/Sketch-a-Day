import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const App = () => {
  const [doodles, setDoodles] = useState([]);
  const [user, setUser] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [overlayImage, setOverlayImage] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [favoritedDoodleId, setFavoritedDoodleId] = useState(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    fetchDoodles();
    checkAndFetchPrompt();
  }, []);

  const fetchDoodles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/doodles`);
      const sortedDoodles = response.data.sort((a, b) => b.favorites - a.favorites);
      setDoodles(sortedDoodles);
    } catch (error) {
      console.error('Error fetching doodles:', error);
    }
  };

  const checkAndFetchPrompt = () => {
    const storedPrompt = localStorage.getItem('dailyPrompt');
    const promptDate = localStorage.getItem('promptDate');

    if (storedPrompt && promptDate === new Date().toDateString()) {
      setPrompt(storedPrompt);
    } else {
      fetchPrompt();
    }
  };

  const fetchPrompt = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prompt`);
      const newPrompt = response.data.prompt;
      setPrompt(newPrompt);
      localStorage.setItem('dailyPrompt', newPrompt);
      localStorage.setItem('promptDate', new Date().toDateString());
    } catch (error) {
      console.error('Error fetching prompt:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoodle = { user, image, description };
      await axios.post(`${API_BASE_URL}/api/doodles`, newDoodle);
      fetchDoodles();
      setUser('');
      setImage('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting doodle:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setOverlayImage(imageUrl);
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    setOverlayImage('');
  };

  const handleFavoriteClick = async (doodleId) => {
    try {
      const isCurrentlyFavorited = favoritedDoodleId === doodleId;

      if (isCurrentlyFavorited) {
        await axios.delete(`${API_BASE_URL}/api/doodles/${doodleId}/favorite`);
        setFavoritedDoodleId(null);
        const lastFavorited = localStorage.getItem('lastFavorited');
        if (lastFavorited && new Date().getDate() === new Date(lastFavorited).getDate()) {
          localStorage.removeItem('lastFavorited');
        }
      } else {
        const lastFavorited = localStorage.getItem('lastFavorited');
        if (lastFavorited && new Date().getDate() === new Date(lastFavorited).getDate()) {
          alert('You can only favorite one doodle per day.');
          return;
        }
        await axios.post(`${API_BASE_URL}/api/doodles/${doodleId}/favorite`);
        setFavoritedDoodleId(doodleId);
        localStorage.setItem('lastFavorited', new Date().toISOString());
      }

      fetchDoodles();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h2>Today's Doodle Challenge: {prompt}</h2>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <br />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit Doodle</button>
        </form>
      </div>

      <div className="gallery">
        {doodles.map((doodle) => (
          <GalleryItem
            key={doodle._id}
            doodle={doodle}
            favoritedDoodleId={favoritedDoodleId}
            onImageClick={handleImageClick}
            onFavoriteClick={handleFavoriteClick}
          />
        ))}
      </div>

      {isOverlayVisible && (
        <div className="overlay overlay-visible" onClick={closeOverlay}>
          <img src={overlayImage} alt="Overlay" />
        </div>
      )}
    </div>
  );
};

const GalleryItem = ({ doodle, favoritedDoodleId, onImageClick, onFavoriteClick }) => (
  <div className="gallery-item">
    <h3>{doodle.user}</h3>
    <img src={doodle.image} alt="Doodle" onClick={() => onImageClick(doodle.image)} />
    <p>{doodle.description}</p>
    <button
      className={`favorite-button ${favoritedDoodleId === doodle._id ? 'favorited' : ''}`}
      onClick={() => onFavoriteClick(doodle._id)}
    >
      ❤️ {doodle.favorites}
    </button>
  </div>
);

export default App;
