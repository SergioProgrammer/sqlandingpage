import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import Brands from './components/Brands.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Sliderletras from './components/Sliderletras.js';
import TimelineV2 from './components/TimelineV2.js';
import './styles/index.css'; 

function App() {
  useEffect(() => {

    const timer = setTimeout(() => {
      console.log("App.js: Attempting to sort and refresh ScrollTriggers...");
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      console.log("App.js: ScrollTriggers sorted and refreshed.");
    }, 200); 
    return () => {
      clearTimeout(timer);
      console.log("App.js: Cleaned up timeout for ScrollTrigger refresh.");
    };
  }, []); 

  return (
    <div className="App">
      <Hero />
      <Brands />
      <Sliderletras />
      <Services />
      <TimelineV2 />
    </div>
  );
}

export default App;