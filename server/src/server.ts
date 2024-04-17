import express from 'express';
import cors from 'cors';
require('dotenv').config();

import { query } from './utils/postgres';
import { getContextString, getMatchingContractVectors } from "./utils/embeddings";
import OpenAI from "openai";

const app = express();
const PORT = 3001;

const openai = new OpenAI()

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {

  const { prompt } = req.body;

  // TODO: Fetch the contract ID from the PostgreSQL database (tip: check the .env file)
  const contractQueryResponse = await query('SELECT id FROM contracts WHERE user_id = 512 LIMIT 1');
  const contractId = contractQueryResponse[0]?.id;

  if (!contractId) {
    res.send({error: 'No contract found'});
    return;
  }

  // TODO: Fetch the relevant vector from Pinecone (tip: they are embedded with text-embedding-ada-002)
  const docs = await getMatchingContractVectors(prompt, 1, `CONTRACT_${contractId}`)

  // TODO: Add a check for the need to use RAG or not.
  // TODO: Add a rerank run to improve accuracy.

  // TODO: Ask GPT to generate a JSON response containing text and a fitting emoji (tip: pass the vector as a context)
  const context = getContextString(docs)

  const userPrompt: OpenAI.ChatCompletionUserMessageParam = {
      role: 'user',
      content: prompt
    }

  const ragPrompt: OpenAI.ChatCompletionSystemMessageParam = {
      role: 'system',
      content: `You are a helpful AI assistant answering user questions about their contracts. 
      Format responses in the following json format: {"text": "response text", "emoji": "emoji"}.
      Come up with matching emojis based on the response you get.
      Context:\\n${context}
      If the answer is not available general knowledge and is not available in the context, the AI assistant will say, "I'm sorry, I don't have the right answer for this".
      `
    }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [ragPrompt, userPrompt],
    });

    const response = completion.choices[0].message.content

    if (response) {
      res.send({
        response: JSON.parse(response)
      })
      return
    } else {
      res.send({
        response: {
          "text": "I wasn't able to find a matching response",
          "emoji": "😕"
        }
      })
    }

    return
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to generate AI response" });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
