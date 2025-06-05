import React from 'react';
import '../styles/Loader.css';

const Loader = ({ isHidden }) => (
    <div className={`loader${isHidden ? ' hidden' : ''}`}>
        <div className="loader-spinner"></div>
        <div className="loader-text">Cargando...</div>
    </div>
);

export default Loader;