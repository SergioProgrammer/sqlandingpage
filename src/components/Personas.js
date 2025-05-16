import React from 'react';
import '../styles/Personas.css';

const AvatarDev = () => (
  <svg className="persona-avatar" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" fill="#232946" stroke="#00bfff" strokeWidth="2"/>
    <ellipse cx="40" cy="48" rx="18" ry="20" fill="#3d2c19"/>
    <ellipse cx="40" cy="38" rx="16" ry="16" fill="#f7d6b3"/>
    <ellipse cx="40" cy="62" rx="10" ry="5" fill="#b48a5a"/>
    <ellipse cx="40" cy="60" rx="14" ry="7" fill="#3d2c19"/>
    <ellipse cx="32" cy="38" rx="2.5" ry="2.5" fill="#232946"/>
    <ellipse cx="48" cy="38" rx="2.5" ry="2.5" fill="#232946"/>
    <rect x="34" y="44" width="12" height="3" rx="1.5" fill="#b48a5a"/>
    <ellipse cx="40" cy="54" rx="6" ry="2" fill="#a97c50"/>
    <ellipse cx="40" cy="58" rx="8" ry="3" fill="#3d2c19"/>
    {/* Barba */}
    <ellipse cx="40" cy="60" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
  </svg>
);

const AvatarArt = () => (
  <svg className="persona-avatar" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" fill="#232946" stroke="#00bfff" strokeWidth="2"/>
    {/* Cabello largo castaño */}
    <ellipse cx="40" cy="50" rx="20" ry="22" fill="#a86b3c"/>
    <ellipse cx="40" cy="32" rx="16" ry="16" fill="#f7d6b3"/>
    {/* Flequillo */}
    <ellipse cx="40" cy="24" rx="12" ry="7" fill="#a86b3c"/>
    {/* Ojos */}
    <ellipse cx="33" cy="34" rx="2.2" ry="2.2" fill="#232946"/>
    <ellipse cx="47" cy="34" rx="2.2" ry="2.2" fill="#232946"/>
    {/* Boca */}
    <path d="M35 42 Q40 46 45 42" stroke="#b48a5a" strokeWidth="2" fill="none" />
    {/* Mejillas */}
    <ellipse cx="32" cy="38" rx="2" ry="1" fill="#f2b8b8" opacity="0.5"/>
    <ellipse cx="48" cy="38" rx="2" ry="1" fill="#f2b8b8" opacity="0.5"/>
  </svg>
);

const Personas = () => {
  return (
    <section className="personas-section">
      <div className="personas-container">
        <h2 className="personas-title">¿Quiénes somos?</h2>
        <div className="personas-cards">
          <div className="persona-card">
            <AvatarDev />
            <h3 className="persona-name">Sergio</h3>
            <p className="persona-role">Especialista en Desarrollo & Marketing Digital</p>
            <p className="persona-desc">
              Apasionado por la tecnología y la estrategia digital, ayudo a marcas a crecer y destacar en el universo online.
            </p>
          </div>
          <div className="persona-card">
            <AvatarArt />
            <h3 className="persona-name">Sara</h3>
            <p className="persona-role">Especialista en Artes Gráficas & Branding</p>
            <p className="persona-desc">
              Creativa y detallista, transformo ideas en identidades visuales únicas y memorables para cada proyecto.
            </p>
          </div>
        </div>
        <div className="personas-summary">
          <p>
            Somos dos profesionales que combinamos <span>marketing, desarrollo web</span> y <span>artes gráficas</span> para ofrecer soluciones integrales, modernas y a medida. Juntos, llevamos tu marca a otro nivel.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Personas;