import React, { useState } from 'react';
import '../styles/Cta.css';

const CTA = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <section className="cta-section" id="contact-cta">
            <h2 className="cta-title">¿Empezamos a trabajar?</h2>
            <div className="cta-form-container">
                <form
                    action="https://formsubmit.co/saraquintanadg@gmail.com" // Cambia este correo si es necesario
                    method="POST"
                >
                    {/* Campos ocultos para configuración de FormSubmit */}
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value="https://saraquintana.info/Gracias" /> {/* Redirección tras envío */}
                    <input type="hidden" name="_subject" value="Nuevo mensaje desde el formulario de contacto" />

                    <div>
                        <label htmlFor="name" className="cta-form-label">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="cta-form-input"
                            placeholder="Tu nombre completo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="cta-form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="cta-form-input"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="cta-form-button">
                        Enviar Mensaje
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CTA;