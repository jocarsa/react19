// WebSocket connection
let socket;
let currentUserId = null;
let currentUserName = null;
let onlineUsers = [];

// Sample data for contacts and messages
const defaultContacts = [
    // Default contacts remain unchanged for demo purposes
    // ... (your original contacts data)
];

// Now working with dynamic contacts list
let contacts = [...defaultContacts];

// DOM Elements
const contactsList = document.querySelector('.contacts-list');
const chatMessages = document.getElementById('chat-messages');
const currentChatName = document.getElementById('current-chat-name');
const currentChatStatus = document.getElementById('current-chat-status');
const currentChatImg = document.getElementById('current-chat-img');
const messageInput = document.getElementById('message-input');

// Initialize the app
function init() {
    promptForUsername();
    renderContacts();
    setupEventListeners();
}

// Prompt user for name on connection
function promptForUsername() {
    const savedName = localStorage.getItem('whatsapp_username');
    let username = savedName;
    
    if (!username) {
        username = prompt("Enter your name:", "User" + Math.floor(Math.random() * 1000));
        if (username) {
            localStorage.setItem('whatsapp_username', username);
        } else {
            username = "User" + Math.floor(Math.random() * 1000);
        }
    }
    
    currentUserName = username;
    connectWebSocket(username);
}

// Connect to WebSocket server
function connectWebSocket(username) {
    // Create WebSocket connection
    socket = new WebSocket("ws://localhost:8765");
    
    // Connection opened
    socket.addEventListener("open", (event) => {
        console.log("Connected to WebSocket server");
        
        // Register with the server
        socket.send(JSON.stringify({
            type: 'register',
            name: username
        }));
    });
    
    // Listen for messages
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        
        switch(message.type) {
            case 'registered':
                // Successfully registered with server
                currentUserId = message.id;
                currentUserName = message.name;
                console.log(`Registered with ID: ${currentUserId}`);
                break;
                
            case 'user_list':
                // Update our contacts list with online users
                updateOnlineUsers(message.users);
                break;
                
            case 'chat_message':
                // Received a message from someone
                handleIncomingMessage(message);
                break;
                
            case 'message_sent':
                // Confirmation our message was processed
                console.log("Message sent successfully");
                break;
                
            case 'chat_history':
                // Process chat history
                loadChatHistory(message.history);
                break;
        }
    });
    
    // Connection closed
    socket.addEventListener("close", (event) => {
        console.log("Disconnected from WebSocket server");
        
        // Try to reconnect after a delay
        setTimeout(() => {
            connectWebSocket(username);
        }, 3000);
    });
    
    // Connection error
    socket.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
    });
}

// Update our contacts list with online users
function updateOnlineUsers(users) {
    // Filter out ourselves
    onlineUsers = users.filter(user => user.id !== currentUserId);
    
    // Merge with our existing contacts
    const updatedContacts = [...defaultContacts];
    
    // Add online users who aren't already in our contacts
    onlineUsers.forEach(user => {
        const existingContact = updatedContacts.find(c => c.id === user.id);
        if (!existingContact) {
            // This is a new online user
            updatedContacts.push({
                id: user.id,
                name: user.name,
                img: user.img,
                lastMessage: "Click to start chatting",
                time: "Now",
                unreadCount: 0,
                status: "online",
                messages: []
            });
        } else {
            // Update status of existing contact
            existingContact.status = "online";
        }
    });
    
    contacts = updatedContacts;
    renderContacts();
}

// Handle incoming message
function handleIncomingMessage(message) {
    const senderId = message.from;
    const messageText = message.text;
    const messageTime = message.time;
    const senderName = message.fromName;
    
    // Find if we already have this contact
    let contact = contacts.find(c => c.id === senderId);
    
    if (!contact) {
        // New contact, add to our list
        contact = {
            id: senderId,
            name: senderName,
            img: "/api/placeholder/50/50",
            lastMessage: messageText,
            time: messageTime,
            unreadCount: 1,
            status: "online",
            messages: []
        };
        contacts.push(contact);
    } else {
        // Update existing contact
        contact.lastMessage = messageText;
        contact.time = messageTime;
        
        // If this chat is not currently open, increment unread
        const activeContact = document.querySelector('.contact.active');
        if (!activeContact || parseInt(activeContact.dataset.contactId) !== senderId) {
            contact.unreadCount++;
        }
    }
    
    // Add message to chat
    const newMessage = {
        text: messageText,
        time: messageTime,
        sent: false
    };
    
    contact.messages.push(newMessage);
    
    // If current chat is open, update it
    const activeContact = document.querySelector('.contact.active');
    if (activeContact && parseInt(activeContact.dataset.contactId) === senderId) {
        renderChat(senderId);
    }
    
    renderContacts();
}

// Load chat history
function loadChatHistory(history) {
    // Process history messages
    history.forEach(msg => {
        if (msg.from === currentUserId) {
            // Message we sent
            const recipientId = msg.to;
            let contact = contacts.find(c => c.id === recipientId);
            
            if (contact) {
                contact.messages.push({
                    text: msg.text,
                    time: msg.time,
                    sent: true
                });
            }
        } else {
            // Message sent to us
            const senderId = msg.from;
            let contact = contacts.find(c => c.id === senderId);
            
            if (contact) {
                contact.messages.push({
                    text: msg.text,
                    time: msg.time,
                    sent: false
                });
            }
        }
    });
    
    // Refresh UI if needed
    const activeContact = document.querySelector('.contact.active');
    if (activeContact) {
        const contactId = parseInt(activeContact.dataset.contactId);
        renderChat(contactId);
    }
}

// Render all contacts
function renderContacts() {
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.classList.add('contact');
        contactElement.dataset.contactId = contact.id;
        
        contactElement.innerHTML = `
            <div class="contact-img">
                <img src="${contact.img}" alt="${contact.name}">
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-time">${contact.time}</div>
                </div>
                <div class="contact-message">
                    <div class="message-preview">${contact.lastMessage}</div>
                    ${contact.unreadCount > 0 ? `<div class="unread-count">${contact.unreadCount}</div>` : ''}
                </div>
            </div>
        `;
        
        contactsList.appendChild(contactElement);
    });
}

// Render chat messages for a specific contact
function renderChat(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    // Update header
    currentChatName.textContent = contact.name;
    currentChatStatus.textContent = contact.status;
    currentChatImg.src = contact.img;
    
    // Update chat messages
    chatMessages.innerHTML = '';
    
    contact.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.sent ? 'sent' : 'received');
        
        const statusIcon = message.sent ? '<i class="fas fa-check-double"></i>' : '';
        
        messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-info">
                <span class="message-time">${message.time}</span>
                <span class="message-status">${statusIcon}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Reset unread count
    contact.unreadCount = 0;
    renderContacts();
    
    // Highlight active contact
    document.querySelectorAll('.contact').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.contact[data-contact-id="${contactId}"]`).classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Contact click event
    contactsList.addEventListener('click', (e) => {
        const contactElement = e.target.closest('.contact');
        if (contactElement) {
            const contactId = contactElement.dataset.contactId;
            renderChat(contactId);
        }
    });
    
    // Send message event
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            const activeContact = document.querySelector('.contact.active');
            if (activeContact) {
                const contactId = activeContact.dataset.contactId;
                sendMessage(contactId, messageInput.value.trim());
                messageInput.value = '';
            }
        }
    });
    
    // Add a button to change username
    const userImg = document.querySelector('.user-img');
    userImg.style.cursor = 'pointer';
    userImg.title = 'Change your name';
    userImg.addEventListener('click', () => {
        const newName = prompt("Change your name:", currentUserName);
        if (newName && newName.trim() !== '') {
            currentUserName = newName;
            localStorage.setItem('whatsapp_username', newName);
            
            // Reconnect with new name
            if (socket) {
                socket.close();
            }
            connectWebSocket(newName);
        }
    });
}

// Send a new message
function sendMessage(contactId, text) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert("Not connected to server!");
        return;
    }
    
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    // Send message to server
    socket.send(JSON.stringify({
        type: 'chat_message',
        to: contactId,
        text: text
    }));
    
    // Update UI immediately without waiting
    const newMessage = {
        text: text,
        time: timeStr,
        sent: true
    };
    
    contact.messages.push(newMessage);
    contact.lastMessage = text;
    contact.time = timeStr;
    
    renderChat(contactId);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);