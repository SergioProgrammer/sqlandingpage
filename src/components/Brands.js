import React from 'react';
import '../styles/Brands.css';

const Brands = () => {
  const logos = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    'ader',
    'logocaia',
    'logocasacriado',
    'logoguantxe',
    'clinicab'
  ]; // Nombres de los archivos de imagen

  return (
    <section className="brands">
      <div className="brands-container">
        {logos.map((logo) => (
          <img
            key={logo}
            src={`/img/${logo}.svg`}
            alt={`Logo ${logo}`}
            className="brand-logo"
          />
        ))}
      </div>
    </section>
  );
};

export default Brands;