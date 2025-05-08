import React, { useEffect, useState, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Brands from './components/Brands.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Sliderletras from './components/Sliderletras.js';
import TimelineV2 from './components/TimelineV2.js';
import Cta from './components/Cta.js';
import Footer from './components/Footer.js';

import './styles/index.css';
import './styles/Loader.css';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const appContentRef = useRef(null);

  useEffect(() => {
    const handleWindowLoad = () => {
      setIsAppLoading(false);
    };

    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    if (!isAppLoading && appContentRef.current) {
      setIsContentLoaded(true);

      const timer = setTimeout(() => {
        if (window.ScrollTrigger) {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAppLoading]);

  const LoaderComponent = () => (
    <div className={`loader ${!isAppLoading && isContentLoaded ? 'hidden' : ''}`}>
      <div className="loader-text">Loading</div>
      <div className="loader-dots">
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
      </div>
    </div>
  );
  return (
    <>
      {isAppLoading && <LoaderComponent />}
      <div
        ref={appContentRef}
        className="App"
      >
        <Hero />
        <Brands />
        <Sliderletras />
        <Services />
        <TimelineV2 />
        <Cta />
        <Footer />
      </div>
    </>
  );
}

export default App;