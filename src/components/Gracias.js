import React, { useEffect } from 'react';
import '../styles/Gracias.css'; 

const Gracias = () => {
    const handleGoBack = () => {
        window.location.href = 'https://saraquintana.info/Cta'; 
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Redirigiendo en breve (simulación)...");
        }, 7000); 

        return () => clearTimeout(timer); 
    }, []); 

    return (
        <section className="gracias-section">
            <div className="gracias-icon"></div>
            <h1 className="gracias-title">¡Mensaje Enviado!</h1>
            <p className="gracias-message">
                Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje
                y te responderemos lo antes posible.
            </p>
            <button onClick={handleGoBack} className="gracias-back-button">
                Volver
            </button>
        </section>
    );
};

export default Gracias;