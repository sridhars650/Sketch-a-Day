// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import CSS file


// src/App.js

function App() {
  const [doodles, setDoodles] = useState([]);
  const [user, setUser] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDoodles();
  }, []);

  const fetchDoodles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/doodles');
      setDoodles(response.data);
    } catch (error) {
      console.error('Error fetching doodles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoodle = {
        user,
        image,
        description,
      };
      await axios.post('http://localhost:3000/api/doodles', newDoodle);
      fetchDoodles();
      setUser('');
      setImage('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting doodle:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Today's Doodle Challenge: </h1>
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
            <img src={doodle.image} alt="Doodle" />
            <p>{doodle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
