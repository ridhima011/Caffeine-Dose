
import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your coffee shop assistant. How can I help you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const newUserMessage = { text: userInput, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setUserInput("");
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Bot is typing...", sender: "bot" },
      ]);

      const botResponse = await getBotResponseFromAPI(userInput);

  
      setMessages((prevMessages) =>
        prevMessages.slice(0, prevMessages.length - 1).concat({ text: botResponse, sender: "bot" })
      );
    }
  };

  const getBotResponseFromAPI = async (userInput) => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('http://localhost:8080/chatbot', {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      console.log(data);
      
      setLoading(false);
      return data.response || "I'm sorry, I didn't understand that. Can you rephrase?";
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setLoading(false);
      return "Sorry, there was an issue with the server. Please try again later.";
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === "bot" ? styles.botMessage : styles.userMessage}>
            {msg.text}
          </div>
        ))}
     
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={styles.input}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <button onClick={handleSendMessage} style={styles.button} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000, 
  },
  messagesContainer: {
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "10px",
  },
  botMessage: {
    backgroundColor: "#f1f1f1",
    padding: "8px",
    borderRadius: "10px",
    margin: "5px 0",
    fontSize: "19px",
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px",
    borderRadius: "10px",
    margin: "5px 0",
    textAlign: "right",
    fontSize: "19px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    backgroundColor: "#342214",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    opacity: 0.9,
  },
};

export default Chatbot;