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
    const cardsRef = useRef([]);

    const addToCardsRefs = el => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const section = sectionRef.current;
        const title = titleRef.current;
        const cards = cardsRef.current;

        if (!section || !title || cards.length === 0) return;

        gsap.to(section, {
            backgroundPosition: '50% 100%',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
            },
        });

        gsap.fromTo(title,
            { autoAlpha: 0, y: 50, clipPath: 'inset(0% 0% 100% 0%)' },
            {
                autoAlpha: 1,
                y: 0,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                },
            }
        );

        gsap.fromTo(cards,
            { autoAlpha: 0, y: 100, scale: 0.9, opacity: 0 },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 60%',
                },
            }
        );

        cards.forEach(card => {
            let tiltTL = gsap.timeline({ paused: true });
            gsap.set(card, { transformPerspective: 1000 });

            tiltTL.to(card, {
                duration: 0.4,
                ease: 'power2.out',
                rotationX: 0,
                rotationY: 0,
                scale: 1.05,
                overwrite: 'auto'
            });

            const handleMouseEnter = (e) => {
                tiltTL.play();
                const rect = card.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (e.clientX - rect.left - centerX) / centerX;
                const offsetY = (e.clientY - rect.top - centerY) / centerY;
                gsap.to(card, {
                    rotationX: offsetY * -7,
                    rotationY: offsetX * 7,
                    duration: 0,
                });
            };

            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (e.clientX - rect.left - centerX) / centerX;
                const offsetY = (e.clientY - rect.top - centerY) / centerY;
                gsap.to(card, {
                    rotationX: offsetY * -7,
                    rotationY: offsetX * 7,
                    duration: 0.2,
                    ease: 'power1.out'
                });
            };

            const handleMouseLeave = () => {
                tiltTL.reverse();
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);

            card._enter = handleMouseEnter;
            card._move = handleMouseMove;
            card._leave = handleMouseLeave;
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            cards.forEach(card => {
                card.removeEventListener('mouseenter', card._enter);
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