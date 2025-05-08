import React from 'react';
import '../styles/Footer.css';
import { FaInstagram } from 'react-icons/fa'; 

const Footer = () => {
    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/sqstudiodm/', '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="footer">
            <div className="footer-content">
            </div>
            <div className="footer-credits">
                <p>
                    &copy; 2025 SQSTUDIO | Todos los derechos reservados. Visita nuestro{' '}
                    <button onClick={handleInstagramClick} className="social-button">
                        <FaInstagram className="instagram-icon" /> 
                    </button>
                </p>
            </div>
        </footer>
    );
};

export default Footer;