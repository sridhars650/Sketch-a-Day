import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import CSS file

function App() {
  const [doodles, setDoodles] = useState([]);
  const [user, setUser] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [overlayImage, setOverlayImage] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [favoritedDoodleId, setFavoritedDoodleId] = useState(null);

  useEffect(() => {
    fetchDoodles();
  }, []);

  const fetchDoodles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/doodles');
      const sortedDoodles = response.data.sort((a, b) => b.favorites - a.favorites);
      setDoodles(sortedDoodles);
    } catch (error) {
      console.error('Error fetching doodles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoodle = { user, image, description };
      await axios.post('http://localhost:3000/api/doodles', newDoodle);
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
        // Unfavorite the doodle
        await axios.delete(`http://localhost:3000/api/doodles/${doodleId}/favorite`);
        setFavoritedDoodleId(null); // Clear favorited doodle ID
  
        // Reset localStorage flag only on unfavorite
        const lastFavorited = localStorage.getItem('lastFavorited');
        if (lastFavorited && new Date().getDate() === new Date(lastFavorited).getDate()) {
          localStorage.removeItem('lastFavorited');
        }
      } else {
        const lastFavorited = localStorage.getItem('lastFavorited');
  
        // Check if a doodle has already been favorited today
        if (lastFavorited && new Date().getDate() === new Date(lastFavorited).getDate()) {
          alert('You can only favorite one doodle per day.');
          return;
        }
  
        // Favorite the doodle
        await axios.post(`http://localhost:3000/api/doodles/${doodleId}/favorite`);
        setFavoritedDoodleId(doodleId); // Set as favorited
  
        // Store in localStorage that this doodle was favorited today
        localStorage.setItem('lastFavorited', new Date().toISOString());
      }
  
      fetchDoodles(); // Refresh doodles to reflect the new favorite count
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
    
  
  

  return (
    <div className="App">
      <header className="header">
        <h1>Draw a stickman!</h1>
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
          <div key={doodle._id} className="gallery-item">
            <h3>{doodle.user}</h3>
            <img
              src={doodle.image}
              alt="Doodle"
              onClick={() => handleImageClick(doodle.image)}
            />
            <p>{doodle.description}</p>
            <button
              className={`favorite-button ${favoritedDoodleId === doodle._id ? 'favorited' : ''}`}
              onClick={() => handleFavoriteClick(doodle._id)}
            >
              ❤️ {doodle.favorites}
            </button>
          </div>
        ))}
      </div>

      {isOverlayVisible && (
        <div className="overlay overlay-visible" onClick={closeOverlay}>
          <img src={overlayImage} alt="Overlay" />
        </div>
      )}
    </div>
  );
}

export default App;
