import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Brands from './components/Brands.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Sliderletras from './components/Sliderletras.js';
import TimelineV2 from './components/TimelineV2.js';
import Cta from './components/Cta.js';
import Footer from './components/Footer.js';
import './styles/index.css';
import './styles/Loader.css'; // Archivo CSS para la barra de carga

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detecta cuando la página ha cargado completamente
    const handleLoad = () => {
      setIsLoading(false); // Oculta la barra de carga
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    // Escucha el evento de carga completa
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad); // Limpia el evento al desmontar
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <div className="loader-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Hero />
      <Brands />
      <Sliderletras />
      <Services />
      <TimelineV2 />
      <Cta />
      <Footer />
    </div>
  );
}

export default App;