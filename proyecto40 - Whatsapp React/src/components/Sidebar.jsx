import React, { useRef } from "react";

export default function Sidebar({
  ws,
  user,
  connected,
  usersList,
  activeChatId,
  onSelectChat,
}) {
  const fileInputRef = useRef(null);

  if (!user) {
    // If we're not registered yet, show a loading or placeholder
    return (
      <div className="sidebar">
        <div className="header">
          <p>Loading user...</p>
        </div>
      </div>
    );
  }

  function handleClickUserImage() {
    // Programmatically open the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result; // "data:image/png;base64,...."
      // Send to server
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "update_profile",
            img: base64Str,
          })
        );
      }
    };
    reader.readAsDataURL(file);
  }

  // If you want to find your own user object from usersList:
  const fullUserData =
    usersList.find((u) => u.id === user.id) || user;

  // Filter out your own user from the contact list if you want
  const contactList = usersList.filter((u) => u.id !== user.id);

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="header">
        <div className="user-img" onClick={handleClickUserImage}>
          <img src={fullUserData.img} alt="User" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="user-name">{fullUserData.name}</div>
        <div className="header-icons">
          <i className="fa fa-comment" />
          <i className="fa fa-ellipsis-v" />
        </div>
      </div>

      {/* Connection status */}
      <div
        className={`connection-status ${
          connected ? "online" : "offline"
        }`}
      >
        {connected ? "Connected" : "Disconnected"}
      </div>

      {/* Contacts Search */}
      <div className="search-container">
        <div className="search">
          <i className="fa fa-search"></i>
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>

      {/* Contacts List */}
      <div className="contacts-list">
        {contactList.map((contact) => (
          <div
            key={contact.id}
            className={`contact ${
              contact.id === activeChatId ? "active" : ""
            }`}
            onClick={() => onSelectChat(contact.id)}
          >
            <div className="contact-img">
              <img src={contact.img} alt="Contact" />
            </div>
            <div className="contact-info">
              <div className="contact-header">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-time">{contact.time}</div>
              </div>
              <div className="contact-message">
                <span className="message-preview">
                  {contact.lastMessage}
                </span>
                {contact.unreadCount > 0 && (
                  <span className="unread-count">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
