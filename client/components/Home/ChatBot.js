import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to chat
    const userMessage = { sender: "user", message: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput(""); // Clear input field

    try {
      // Correct API payload
     const response = await axios ({
  url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key= AIzaSyCVQW1HuW4A3cT0PgBIxpW87YM5ql0iVzo" ,
  method : "post" , 
  data : {
    contents:[
      {parts :[{text :"5 + 5"}] },
  ],
},
});

      // Extract response content
      const botResponse =
        response.data.candidates?.[0]?.content || "No response from AI";

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: "Error communicating with AI." },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-md ${
              msg.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="input-section flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
