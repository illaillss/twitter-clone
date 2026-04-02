// Simple in-memory database (for demo purposes)
let users = [];
let tweets = [];

export default function handler(req, res) {
  const { method, query } = req;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case 'GET':
        if (query.type === 'users') {
          return res.status(200).json(users);
        }
        if (query.type === 'tweets') {
          return res.status(200).json(tweets);
        }
        return res.status(400).json({ error: 'Invalid query type' });

      case 'POST':
        if (query.type === 'users') {
          const newUser = req.body;
          newUser.id = Date.now().toString();
          users.push(newUser);
          return res.status(201).json(newUser);
        }
        if (query.type === 'tweets') {
          const newTweet = req.body;
          newTweet.id = Date.now().toString();
          tweets.unshift(newTweet);
          return res.status(201).json(newTweet);
        }
        return res.status(400).json({ error: 'Invalid query type' });

      case 'PUT':
        if (query.type === 'tweets' && query.id) {
          const index = tweets.findIndex(t => t.id === query.id);
          if (index !== -1) {
            tweets[index] = { ...tweets[index], ...req.body };
            return res.status(200).json(tweets[index]);
          }
          return res.status(404).json({ error: 'Tweet not found' });
        }
        return res.status(400).json({ error: 'Invalid query type' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
