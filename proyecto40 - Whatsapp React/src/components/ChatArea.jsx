import React, { useEffect, useState, useRef } from "react";

export default function ChatArea({
  ws,
  user,
  connected,
  messages,
  activeChatId,
  onSendMessage,
}) {
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!activeChatId) {
    return (
      <div className="chat-area">
        <div className="no-chat-selected">
          <i className="fa fa-comments"></i>
          <h2>Select a chat to start messaging</h2>
        </div>
      </div>
    );
  }

  // Filter messages to only show those for this conversation:
  //  If activeChatId === 'GROUP', show group messages (to === 'GROUP') + any from/to user (if you want)
  //  If it's a direct chat, show from: user->contact or from: contact->user
  let chatMessages = [];
  if (activeChatId === "GROUP") {
    // Show all messages where to === "GROUP" or from === user.id with to "GROUP"
    chatMessages = messages.filter(
      (m) => m.to === "GROUP" || (m.from === user.id && m.to === "GROUP")
    );
  } else {
    // Show messages either from user->activeChat or from activeChat->user
    chatMessages = messages.filter(
      (m) =>
        (m.from === user.id && m.to === activeChatId) ||
        (m.from === activeChatId && m.to === user.id)
    );
  }

  function handleSend() {
    if (!draft.trim()) return;
    onSendMessage(activeChatId, draft.trim());
    setDraft("");
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-img">
            {/* You could display the contact's image or a group icon */}
            <img
              src="https://via.placeholder.com/40"
              alt="Chat"
            />
          </div>
          <div className="chat-details">
            <h4>{activeChatId === "GROUP" ? "Group Chat" : activeChatId}</h4>
            <p>{connected ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="chat-header-icons">
          <i className="fa fa-search"></i>
          <i className="fa fa-paperclip"></i>
          <i className="fa fa-ellipsis-v"></i>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {chatMessages.map((msg, index) => {
          const isSent = msg.from === user.id;
          return (
            <div
              key={index}
              className={`message ${isSent ? "sent" : "received"}`}
            >
              <div>{msg.text}</div>
              <div className="message-info">
                <span className="message-time">{msg.time}</span>
                {isSent && (
                  <span className="message-status">
                    <i className="fa fa-check"></i>
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-input-area">
        <i className="fa fa-smile-o"></i>
        <input
          type="text"
          placeholder="Type a message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <i className="fa fa-microphone" onClick={handleSend}></i>
      </div>
    </div>
  );
}
