const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

const PORT = 3000;
const UNSPLASH_KEY = 'UYrlDihZU19tqfdcc3xvDPe7HglleULsVU6H4vD7yXQ'; // Replace this

// IMAGE API
app.get('/api/images', async (req, res) => {
  const query = req.query.query;
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 9 },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });
    const imageUrls = response.data.results.map(img => img.urls.small);
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// DOCUMENTS API
app.get('/api/documents', async (req, res) => {
  const query = req.query.query;

  try {
    const response = await axios.get('https://api.crossref.org/works', {
      params: { query: query, rows: 5 }
    });

    const results = response.data.message.items.map(item => ({
      title: item.title[0],
      url: item.URL
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents from API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});