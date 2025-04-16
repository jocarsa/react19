import React from 'react';
import './Footer.css';

const Footer = ({ footerText }) => {
    return (
        <footer>
            <p className="footer-text">{footerText}</p>
        </footer>
    );
};

export default Footer;
