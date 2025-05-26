import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const servicesData = [
        {
            id: 'web',
            title: 'Estrategia',
            description: 'La estrategia guía cada una de nuestras decisiones y está integrada desde el inicio en todo nuestro proceso.'
        },
        {
            id: 'audit',
            title: 'Creatividad',
            description: 'Ya sea que necesites un sitio web, una campaña publicitaria, o un sistema de diseño...'
        },
        {
            id: 'marketing',
            title: 'Branding',
            description: 'Nos destacamos tanto en hacer evolucionar marcas existentes como en dar vida a nuevas.'
        },
        {
            id: 'design',
            title: 'Desarrollo',
            description: 'Creamos identidades visuales que brillan con luz propia, transformando conceptos en arte digital estelar.'
        }
    ];

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const mainTweenRef = useRef(null);
    const panelAnimationsRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;
        const panels = Array.from(track.children);
        if (panels.length === 0) return;

        // Cleanup
        if (mainTweenRef.current) mainTweenRef.current.kill();
        panelAnimationsRef.current.forEach(anim => anim && anim.kill());

        gsap.set(track, { clearProps: 'transform' });

        panels.forEach(panel => {
            const title = panel.querySelector('.service-content h1');
            const paragraph = panel.querySelector('.service-content p');
            if (title) gsap.set(title, { clearProps: 'all' });
            if (paragraph) gsap.set(paragraph, { clearProps: 'all' });
            panel.classList.remove('is-active-panel');
        });

        const newTween = gsap.to(track, {
            xPercent: -100 * (panels.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 0.8,
                snap: 1 / (panels.length - 1),
                end: () => `+=${container.offsetWidth * (panels.length - 1) * 1.2}`,
                invalidateOnRefresh: true
            }
        });

        mainTweenRef.current = newTween;

        // Animaciones por panel
        panelAnimationsRef.current = panels.map((panel) => {
            const title = panel.querySelector('.service-content h1');
            const paragraph = panel.querySelector('.service-content p');
            gsap.set([title, paragraph], { autoAlpha: 0 });

            return gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: newTween,
                    start: 'left 65%',
                    end: 'right 35%',
                    toggleActions: 'play reverse play reverse'
                }
            })
            .fromTo(title, { autoAlpha: 0, y: 70, rotationX: -70 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'expo.out' })
            .fromTo(paragraph, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");
        });

        return () => {
            if (mainTweenRef.current) mainTweenRef.current.kill();
            panelAnimationsRef.current.forEach(anim => anim && anim.kill());
        };
    }, []);

    return (
        <div className="services-container" ref={containerRef}>
            <div className="services-track" ref={trackRef}>
                {servicesData.map((service, idx) => (
                    <section key={service.id} className={`service-panel panel-${idx}`}>
                        {idx === 0 && (
                            <img src="/img/estrategia.jpg" alt="Estrategia" className="estrategia-img" />
                        )}
                        {idx === 1 && (
                            <img src="/img/creatividad.webp" alt="Creatividad" className="creatividad-img" />
                        )}
                        <div className="service-content">
                            <h1>{service.title}</h1>
                            <p>{service.description}</p>
                        </div>
                        {idx === 2 && (
                            <img src="#" alt="Branding" className="favicon-img" />
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Services;