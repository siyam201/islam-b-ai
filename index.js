import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

if (process.env.GEMINI_API_KEY === "") {
  console.error(`You haven't set up your API key yet.
If you don't have an API key yet, visit:
https://makersuite.google.com/app/apikey
1. Make an account or sign in
2. Create a new API key

Then, open the Secrets Tool and add GEMINI_API_KEY as a secret.`);
  process.exit(1);
}

const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.static('.'));
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const result = await chat.sendMessage(req.body.message + " (Please provide an Islamic perspective and respond in Bangla language. Base your answers on authentic Islamic sources when relevant)");
    const response = await result.response;
    res.json({ response: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});