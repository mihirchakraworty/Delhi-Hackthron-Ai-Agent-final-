const axios = require('axios');
const NodeCache = require('node-cache');

const wikiCache = new NodeCache({ stdTTL: 86400 }); // 24 hours

const getPlaceInfo = async (place) => {
  try {
    const cached = wikiCache.get(`wiki_${place}`);
    if (cached) return { ...cached, fromCache: true };

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`;

    const response = await axios.get(summaryUrl, {
      headers: { 'User-Agent': 'AI-Travel-Planner/1.0 (Contact: info@example.com)' },
      timeout: 10000,
    });

    const placeData = formatPlaceData(response.data);
    wikiCache.set(`wiki_${place}`, placeData);

    return { success: true, ...placeData };

  } catch (error) {
    console.error('Wikipedia API Error:', error.message);
    return {
      success: false,
      title: place,
      description: `Unable to fetch detailed information about ${place}`,
      suggestion: 'Try searching with alternative names or nearby cities.',
      image: '',
      attractions: [],
    };
  }
};

const formatPlaceData = (data) => ({
  title: data.title || 'Unknown',
  description: data.extract || 'No description available',
  contentUrl: data.content_urls?.desktop?.page || '',
  imageUrl: data.originalimage?.source || data.thumbnail?.source || '',
  image: data.originalimage?.source || data.thumbnail?.source || '',
  coordinates: data.coordinates || { latitude: null, longitude: null },
  language: data.lang || 'en',
  lastModified: data.timestamp || new Date(),
  attractions: generateAttractions(data.extract || ''),
});

const generateAttractions = (description) => {
  const attractions = [];
  const keywords = ['temple', 'palace', 'fort', 'park', 'museum', 'beach', 'monument', 'garden'];

  keywords.forEach(keyword => {
    if (description.toLowerCase().includes(keyword)) {
      attractions.push({
        name: keyword.charAt(0).toUpperCase() + keyword.slice(1) + 's',
        type: keyword,
        description: `${keyword} related attractions in the area`,
      });
    }
  });

  return attractions;
};

module.exports = { getPlaceInfo, wikiCache };
