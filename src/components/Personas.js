import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Personas.css';

gsap.registerPlugin(ScrollTrigger);

const AvatarDev = () => (
  <svg className="persona-avatar" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#33373E" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <ellipse cx="40" cy="48" rx="18" ry="20" fill="#25282D"/>
    <ellipse cx="40" cy="38" rx="16" ry="16" fill="#AEB8C4"/>
    <ellipse cx="40" cy="62" rx="10" ry="5" fill="#7F8C8D"/>
    <ellipse cx="40" cy="60" rx="14" ry="7" fill="#25282D"/>
    <ellipse cx="32" cy="38" rx="2.5" ry="2.5" fill="#1E2227"/>
    <ellipse cx="48" cy="38" rx="2.5" ry="2.5" fill="#1E2227"/>
    <rect x="34" y="44" width="12" height="3" rx="1.5" fill="#7F8C8D"/>
    <ellipse cx="40" cy="54" rx="6" ry="2" fill="#95A5A6"/>
    <ellipse cx="40" cy="58" rx="8" ry="3" fill="#25282D"/>
    <ellipse cx="40" cy="60" rx="10" ry="5" fill="#1E2227" opacity="0.8"/>
  </svg>
);

const AvatarArt = () => (
  <svg className="persona-avatar" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#33373E" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <ellipse cx="40" cy="50" rx="20" ry="22" fill="#4A4E54"/>
    <ellipse cx="40" cy="32" rx="16" ry="16" fill="#AEB8C4"/>
    <ellipse cx="40" cy="24" rx="12" ry="7" fill="#4A4E54"/>
    <ellipse cx="33" cy="34" rx="2.2" ry="2.2" fill="#1E2227"/>
    <ellipse cx="47" cy="34" rx="2.2" ry="2.2" fill="#1E2227"/>
    <path d="M35 42 Q40 44 45 42" stroke="#7F8C8D" strokeWidth="1.5" fill="none" />
    <ellipse cx="32" cy="38" rx="2" ry="1" fill="#BDC3C7" opacity="0.3"/>
    <ellipse cx="48" cy="38" rx="2" ry="1" fill="#BDC3C7" opacity="0.3"/>
  </svg>
);

const Personas = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);
    cardsRef.current = [];
    const summaryRef = useRef(null);

    const addToCardsRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const currentSection = sectionRef.current;
        const currentTitle = titleRef.current;
        const currentCards = cardsRef.current;
        const currentSummary = summaryRef.current;

        if (!currentSection || !currentTitle || currentCards.length === 0 || !currentSummary) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: currentSection,
                start: "top 70%",
                toggleActions: "play none none none",
            }
        });

        gsap.set(currentTitle, { autoAlpha: 0, y: 40 });
        gsap.set(currentCards, { autoAlpha: 0, y: 50, scale: 0.9 });
        gsap.set(currentSummary, { autoAlpha: 0, y: 40 });

        tl.to(currentTitle, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out"
        })
        .to(currentCards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.25,
            ease: "expo.out"
        }, "-=0.7")
        .to(currentSummary, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out"
        }, "-=0.6");

        return () => {
            tl.kill();
        };

    }, []);

    return (
        <section className="personas-section" ref={sectionRef}>
            <div className="personas-container">
                <h2 className="personas-title" ref={titleRef}>Especialistas en lo nuestro</h2>
                <div className="personas-cards">
                    <div className="persona-card" ref={addToCardsRefs}>
                        <div className="persona-avatar-wrapper">
                            <div className="persona-avatar-container">
                                <AvatarDev />
                            </div>
                        </div>
                        <h3 className="persona-name">Sergio Sandoval</h3>
                        <p className="persona-role">Desarrollo & Estrategia Digital</p>
                        <p className="persona-desc">
                            Impulsando la innovación con código y datos para crear soluciones digitales que definen el futuro.
                        </p>
                    </div>
                    <div className="persona-card" ref={addToCardsRefs}>
                        <div className="persona-avatar-wrapper">
                            <div className="persona-avatar-container">
                                <AvatarArt />
                            </div>
                        </div>
                        <h3 className="persona-name">Sara Quintana</h3>
                        <p className="persona-role">Diseño de Marca & Experiencia Visual</p>
                        <p className="persona-desc">
                            El arte de transformar conceptos en narrativas visuales impactantes que conectan y perduran.
                        </p>
                    </div>
                </div>
                <div className="personas-summary" ref={summaryRef}>
                    <p>
                        Un dúo de creativos y estrategas. Fusionamos <span>diseño vanguardista</span> con <span>tecnología de punta</span> para construir experiencias digitales memorables y efectivas.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Personas;