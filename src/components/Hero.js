import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/img/hero1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>DESIGN STUDIO</h1>
        <p>Estudio de diseño y desarrollo en España</p>
      </div>
    </section>
  );
};

export default Hero;