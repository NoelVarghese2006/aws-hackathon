// pages/chatbot.js
"use client";

import React, { useState } from 'react';
import styles from './Chatbot.module.css';
import axios from 'axios';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [currentChat, setCurrentChat] = useState(''); // Tracks current chat log

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const temp = input;
    setInput(''); // Clear the input field
  
    const userMessage = { sender: 'user', text: temp };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message first
  
    try {
      const botResponse = await generateBotResponse(input); // Wait for bot response
      await typeBotMessage(botResponse.text); // Call the typing function
    } catch (error) {
      console.error("Error in bot response:", error);
    }
  };
  
  const typeBotMessage = async (messageText) => {
    // Create an empty message for the bot first
    const botMessage = { sender: 'bot', text: '' };
    setMessages((prevMessages) => [...prevMessages, botMessage]); // Add the empty bot message
  
    for (let i = 0; i < messageText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Typing speed (50ms per letter)
  
      setMessages((prevMessages) => {
        // Create a new array to avoid modifying the original array directly
        const updatedMessages = [...prevMessages];
  
        // Get the last message (the bot message being typed)
        const lastMessage = { ...updatedMessages[updatedMessages.length - 1] };
  
        if (lastMessage.sender === 'bot') {
          // Append the next character
          lastMessage.text += messageText[i];
          updatedMessages[updatedMessages.length - 1] = lastMessage; // Update the last message in the array
        }
  
        return updatedMessages;
      });
    }
  };

  const generateBotResponse = async (input) => {
    try {
      const response = await axios.post(
        '/api/chat',
        { query: input }
      );
      return { sender: 'bot', text: response.data.response };
    } catch (error) {
      console.error("Error fetching data: ", error);
      return { sender: 'bot', text: "Sorry, something went wrong." }; // Fallback response
    }
  };

  const startNewChat = () => {
    setChatLogs((prevLogs) => {
      // Save the current messages to chatLogs
      if (messages.length > 0 && currentChat) {
        return {
          ...prevLogs,
          [currentChat]: messages, // Store current messages under currentChat ID
        };
      }
      return prevLogs;
    });
  
    // Now create the new chat ID and reset the chat window
    setCurrentChat((prevChatId) => {
      const newChatId = `Chat ${Object.keys(chatLogs).length + 1}`;
      setMessages([]); // Clear out messages for the new chat
      return newChatId;
    });
  };
  
  

  const handleSelectChat = (chatId) => {
    setCurrentChat(chatId);
    setMessages(chatLogs[chatId] || []);
  };

  return (
    <div className={styles.chatbotContainer}>
      <aside className={styles.sidebar}>
        <button className={styles.newChatButton} onClick={startNewChat}>
          New Chat
        </button>
        <ul className={styles.chatLogList}>
          {Object.keys(chatLogs).map((chatId) => (
            <li
              key={chatId}
              className={styles.chatLogItem}
              onClick={() => handleSelectChat(chatId)}
            >
              {chatId}
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === 'user' ? styles.userMessage : styles.botMessage}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className={styles.messageInput}
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
