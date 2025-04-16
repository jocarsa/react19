import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

export default function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Open WebSocket only once
  useEffect(() => {
    const socket = new WebSocket("wss://jocarsa.com:3000");
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      // Register this client
      socket.send(
        JSON.stringify({
          type: "register",
          name: "John Doe" // or prompt user for name
        })
      );
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      // console.log("Received:", data);

      switch (type) {
        case "registered":
          // This is our own user info from the server
          setUser({
            id: data.id,
            name: data.name,
            img: "/api/placeholder/50/50", // default from server
          });
          break;

        case "user_list":
          setUsersList(data.users);
          break;

        case "chat_history":
          // This is the entire relevant chat history for this user
          setMessages(data.history || []);
          break;

        case "chat_message":
          // A new incoming message from someone else (or group, if group was not excluding us)
          // Only add if it's not from ourselves. (Though typically for group we exclude ourselves anyway.)
          setMessages((prev) => [...prev, data]);
          break;

        case "message_sent":
          // Confirmation of our own sent message
          // Add it to local state
          setMessages((prev) => [...prev, data]);
          break;

        default:
          // Unknown message type
          break;
      }
    };
  }, [ws]);

  // Handler to send a chat message
  const sendMessage = (to, text) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "chat_message", to, text }));
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <Sidebar
        ws={ws}
        user={user}
        connected={connected}
        usersList={usersList}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
      />
      {/* Chat Area */}
      <ChatArea
        ws={ws}
        user={user}
        connected={connected}
        messages={messages}
        activeChatId={activeChatId}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
