const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // OpenAI key-ga environment variable-ka ku jira
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: question }],
    });

    const answer = completion.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
