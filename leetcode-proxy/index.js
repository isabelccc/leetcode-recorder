const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/leetcode', async (req, res) => {
  const { slug } = req.body;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          title
          difficulty
          content
          topicTags { name }
        }
      }`,
      variables: { titleSlug: slug },
    }),
  });

  const data = await response.json();
  res.json(data.data?.question || {});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`)); 