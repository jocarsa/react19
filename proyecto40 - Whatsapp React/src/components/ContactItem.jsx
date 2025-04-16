import React from "react";

function ContactItem({ contact, active, onSelectContact }) {
  return (
    <div className={`contact ${active ? "active" : ""}`} onClick={onSelectContact}>
      <div className="contact-img">
        <img src={contact.img} alt={contact.name} />
      </div>
      <div className="contact-info">
        <div className="contact-header">
          <div className="contact-name">{contact.name}</div>
          <div className="contact-time">{contact.time}</div>
        </div>
        <div className="contact-message">
          <div className="message-preview">{contact.lastMessage}</div>
          {contact.unreadCount > 0 && (
            <div className="unread-count">{contact.unreadCount}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactItem;
