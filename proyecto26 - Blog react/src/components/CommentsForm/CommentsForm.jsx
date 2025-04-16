import React, { useState } from 'react';
import './CommentsForm.css';

const CommentsForm = ({ onAddComment }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            name,
            email,
            comment,
            date: new Date().toLocaleDateString()
        };
        onAddComment(newComment);
        // Clear the form fields
        setName('');
        setEmail('');
        setComment('');
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="name" 
                placeholder="Your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
            />
            <input 
                type="email" 
                name="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />
            <textarea 
                name="comment" 
                placeholder="Your comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required 
            ></textarea>
            <input type="submit" value="Submit Comment" />
        </form>
    );
};

export default CommentsForm;
