import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Importa ScrollTrigger aquí
// No es necesario importar gsap aquí si cada componente ya lo hace y registra sus plugins

// Tus componentes
import Brands from './components/Brands.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Sliderletras from './components/Sliderletras.js';
import TimelineV2 from './components/TimelineV2.js';

import './styles/index.css'; // Tu CSS global para la aplicación

function App() {
  useEffect(() => {
    // Este efecto se ejecuta una vez después de que el componente App y todos sus hijos
    // se hayan montado y sus propios useEffects (donde se crean los ScrollTriggers)
    // hayan tenido la oportunidad de ejecutarse.

    // Damos un pequeño respiro para asegurar que todo esté en el DOM y calculado inicialmente.
    const timer = setTimeout(() => {
      console.log("App.js: Attempting to sort and refresh ScrollTriggers...");

      // Ordena los ScrollTriggers basado en su posición en el DOM.
      // Esto es importante si los triggers se crean en un orden diferente al que aparecen.
      ScrollTrigger.sort();

      // Vuelve a calcular todas las posiciones de inicio/fin de los ScrollTriggers.
      // Esencial si el layout ha cambiado debido a pinning o contenido dinámico.
      ScrollTrigger.refresh();

      console.log("App.js: ScrollTriggers sorted and refreshed.");
    }, 200); // Aumenté ligeramente el timeout a 200ms; ajústalo si es necesario.
               // Para layouts muy complejos o con muchas imágenes, podrías necesitar más.
               // También puedes probar con un valor más bajo como 50 o 100.

    // Limpieza del temporizador cuando el componente App se desmonta (aunque esto es raro para App).
    return () => {
      clearTimeout(timer);
      console.log("App.js: Cleaned up timeout for ScrollTrigger refresh.");
    };
  }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez.

  return (
    <div className="App">
      <Hero />
      <Brands />
      <Sliderletras />
      <Services />
      <TimelineV2 />
      {/* Puedes añadir más componentes aquí como un Footer, etc. */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;