import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/sqstudiodm/', '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="footer">
            <div className="footer-content">
            </div>
            <div className="footer-credits">
                <p style={{ fontSize: '1em', color: 'black' }}>
                    &copy; 2025 SQSTUDIO | Todos los derechos reservados. Visita nuestro{' '}
                    <button
                        onClick={handleInstagramClick}
                        className="social-button"
                        style={{
                            color: 'black',
                            background: 'none',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '1em',
                        }}
                    >
                        Instagram
                    </button>
                </p>
            </div>
        </footer>
    );
};

export default Footer;