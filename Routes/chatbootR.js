const express = require('express');
const router = express.Router();
const { getBotResponse } = require('../Controllers/chabootCon');
const { console } = require('inspector');

router.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log(userMessage);

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: "Message is required and should be a string." });
    }

    console.log("User message:", userMessage);
    const botResponse = await getBotResponse(userMessage);

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error in chatbot route:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});

module.exports = router;

