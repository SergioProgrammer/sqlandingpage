import React from 'react';
import '../styles/Sliderletras.css';

const Sliderletras = () => {
  return (
    <div className="slider-letras">
      <div className="slider-track">
        {Array(20).fill("SERVICIOS").map((word, index) => (
          <span key={index} className="slider-word">{word}</span>
        ))}
      </div>
    </div>
  );
};

export default Sliderletras;