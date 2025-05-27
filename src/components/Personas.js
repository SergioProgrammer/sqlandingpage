import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Personas.css';

gsap.registerPlugin(ScrollTrigger);

const PersonaCard = ({ image, name, role, description, addRef }) => (
    <div className="persona-card" ref={addRef}>
        <div className="persona-avatar-wrapper">
            <div className="persona-avatar-container">
                <img src={image} alt={name} className="persona-photo" />
            </div>
        </div>
        <h3 className="persona-name">{name}</h3>
        <p className="persona-role">{role}</p>
        <p className="persona-desc">{description}</p>
    </div>
);

const Personas = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const summaryRef = useRef(null);
    const cardsRef = useRef([]);
    cardsRef.current = [];

    const addToCardsRefs = el => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const section = sectionRef.current;
        const title = titleRef.current;
        const summary = summaryRef.current;
        const cards = cardsRef.current;

        if (!section || !title || !summary || cards.length === 0) return;

        // Parallax fondo
        gsap.to(section, {
            backgroundPosition: '50% 100%',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Animaciones de entrada
        gsap.set([title, summary], { autoAlpha: 0, y: 40 });
        gsap.to(title, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
        });
        gsap.to(summary, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
            },
        });

        gsap.set(cards, { autoAlpha: 0, y: 80, scale: 0.95 });
        gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
            },
        });

        // Tilt mouse
        const handleMouseMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const offsetX = (e.clientX - rect.left - centerX) / centerX;
            const offsetY = (e.clientY - rect.top - centerY) / centerY;
            card.style.transform = `rotateX(${offsetY * -5}deg) rotateY(${offsetX * 5}deg) scale(1.02)`;
        };

        const handleMouseLeave = card => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        };

        cards.forEach(card => {
            const move = e => handleMouseMove(e, card);
            const leave = () => handleMouseLeave(card);
            card.addEventListener('mousemove', move);
            card.addEventListener('mouseleave', leave);
            card._move = move;
            card._leave = leave;
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            cards.forEach(card => {
                card.removeEventListener('mousemove', card._move);
                card.removeEventListener('mouseleave', card._leave);
            });
        };
    }, []);

    return (
        <section className="personas-section" ref={sectionRef}>
            <div className="personas-container">
                <h2 className="personas-title" ref={titleRef}>Especialistas en lo nuestro</h2>
                <div className="personas-cards">
                    <PersonaCard
                        image="/img/sergio.png"
                        name="Sergio Sandoval"
                        role="Desarrollo & Estrategia Digital"
                        description="Impulsando la innovación con código y datos para crear soluciones digitales que definen el futuro."
                        addRef={addToCardsRefs}
                    />
                    <PersonaCard
                        image="/img/sara.png"
                        name="Sara Quintana"
                        role="Diseño de Marca & Experiencia Visual"
                        description="El arte de transformar conceptos en narrativas visuales impactantes que conectan y perduran."
                        addRef={addToCardsRefs}
                    />
                </div>
            </div>
        </section>
    );
};

export default Personas;
