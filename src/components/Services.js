import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const servicesData = [
        { id: 'web', title: 'Estrategia', description: 'La estrategia guía cada una de nuestras decisiones y está integrada desde el inicio en todo nuestro proceso. Nos especializamos en resolver problemas complejos y en crear soluciones orientadas a resultados: desde optimizar la arquitectura de la información y construir una marca sólida, hasta diseñar wireframes alineados con tus principales KPI.' },
        { id: 'audit', title: 'Creatividad', description: 'Ya sea que necesites un sitio web, una campaña publicitaria, un sistema de diseño o un video, nuestro enfoque combina diseño audaz con objetivos estratégicos claros. Podemos ser tu equipo creativo principal o complementar a tus equipos internos. En ambos casos, aportamos ideas frescas, procesos consolidados y experiencia. El equipo que te presente la propuesta será el mismo que trabajará contigo.' },
        { id: 'marketing', title: 'Branding', description: 'Nos destacamos tanto en hacer evolucionar marcas existentes como en dar vida a nuevas. Nuestra experiencia en diversos sectores nos permite aportar una energía renovada a cada proyecto. Gracias a nuestras guías y sistemas, cualquier equipo puede ejecutar con rapidez y coherencia.' },
        { id: 'design', title: 'Desarrollo', description: 'Creamos identidades visuales que brillan con luz propia, transformando conceptos en arte digital estelar.' },
    ];

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const progressDotsRef = useRef([]);
    progressDotsRef.current = [];

    const mainTweenRef = useRef(null);
    const mainSTRef = useRef(null);
    const panelAnimationsRef = useRef([]);

    const addToProgressDotsRefs = (el) => el && !progressDotsRef.current.includes(el) && progressDotsRef.current.push(el);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const currentTrack = trackRef.current;

        if (!currentContainer || !currentTrack) return;
        const panels = Array.from(currentTrack.children);
        if (panels.length === 0) return;

        const cleanup = () => {
            if (mainSTRef.current) mainSTRef.current.kill();
            if (mainTweenRef.current) mainTweenRef.current.kill();
            panelAnimationsRef.current.forEach(anim => anim && anim.kill());

            mainSTRef.current = null;
            mainTweenRef.current = null;
            panelAnimationsRef.current = [];
            progressDotsRef.current.forEach(dot => dot && dot.classList.remove('is-active'));

            gsap.set(currentTrack, { clearProps: "transform" });
            panels.forEach(panel => {
                const title = panel.querySelector('.service-content h1');
                const paragraph = panel.querySelector('.service-content p');
                const dustParticles = panel.querySelectorAll('.cosmic-dust');

                if (title) gsap.set(title, { clearProps: "all" });
                if (paragraph) gsap.set(paragraph, { clearProps: "all" });
                dustParticles.forEach(particle => gsap.set(particle, { clearProps: "all" }));
                panel.classList.remove('is-active-panel');
            });
        };
        cleanup();

        const amountToScroll = -100 * (panels.length - 1);
        let createdMainSTInstance = null;

        const newMainTween = gsap.to(currentTrack, {
            xPercent: amountToScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: currentContainer,
                pin: true,
                scrub: 0.8,
                snap: {
                    snapTo: 1 / (panels.length - 1),
                    duration: { min: 0.4, max: 0.7 },
                    delay: 0.02,
                    ease: 'power3.inOut',
                },
                end: () => `+=${currentContainer.offsetWidth * (panels.length - 1) * 1.2}`,
                invalidateOnRefresh: true,
                markers: false,
                onCreate: (self) => createdMainSTInstance = self,
                onUpdate: self => {
                    const progress = Math.round(self.progress * (panels.length - 1));
                    progressDotsRef.current.forEach((dot, idx) => {
                        if (dot) dot.classList.toggle('is-active', idx === progress);
                    });
                    panels.forEach((p, idx) => p.classList.toggle('is-active-panel', idx === progress));
                },
            },
        });
        mainTweenRef.current = newMainTween;
        mainSTRef.current = createdMainSTInstance;

        const tempPanelAnims = [];
        panels.forEach((panelElement, index) => {
            const title = panelElement.querySelector('.service-content h1');
            const paragraph = panelElement.querySelector('.service-content p');
            const dustParticles = panelElement.querySelectorAll('.cosmic-dust');

            gsap.set([title, paragraph], { autoAlpha: 0 });

            if (title && paragraph) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: panelElement,
                        containerAnimation: newMainTween,
                        start: 'left 65%',
                        end: 'right 35%',
                        toggleActions: 'play reverse play reverse',
                    }
                });
                tl.fromTo(title,
                    { autoAlpha: 0, y: 70, rotationX: -70, transformOrigin: "50% 50% -50px" },
                    { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'expo.out' }
                )
                .fromTo(paragraph,
                    { autoAlpha: 0, y: 50 },
                    { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    "-=0.6"
                );
                tempPanelAnims.push(tl);
            }

            dustParticles.forEach((particle) => {
                gsap.set(particle, {
                    x: () => gsap.utils.random(-15, 15) + "vw",
                    y: () => gsap.utils.random(-15, 15) + "vh",
                    scale: () => gsap.utils.random(0.3, 1),
                    opacity: 0
                });
                const particleTween = gsap.timeline({
                    scrollTrigger: {
                        trigger: panelElement,
                        containerAnimation: newMainTween,
                        scrub: 2.5,
                        start: 'left right',
                        end: 'right left',
                    }
                })
                .to(particle, {
                    x: () => gsap.utils.random(-25, 25) + "vw",
                    y: () => gsap.utils.random(-25, 25) + "vh",
                    opacity: () => gsap.utils.random(0.2, 0.6),
                    duration: () => gsap.utils.random(3, 6),
                    ease: 'power1.inOut'
                })
                .to(particle, {
                    opacity: 0,
                    duration: () => gsap.utils.random(1, 2),
                    ease: 'power1.inOut'
                }, ">-=1");
                tempPanelAnims.push(particleTween);
            });
        });
        panelAnimationsRef.current = tempPanelAnims;

        if (progressDotsRef.current[0]) progressDotsRef.current[0].classList.add('is-active');
        if (panels[0]) panels[0].classList.add('is-active-panel');

        return cleanup;
    }, [servicesData.length]);

    const renderCosmicDust = (count = 10) => {
        let dusts = [];
        for (let i = 0; i < count; i++) {
            const size = gsap.utils.random(2, 8);
            dusts.push(
                <div
                    key={`dust-${i}`}
                    className="cosmic-dust"
                    style={{ width: `${size}px`, height: `${size}px` }}
                ></div>
            );
        }
        return dusts;
    };

    return (
        <div className="services-container" ref={containerRef}>
            <div className="services-track" ref={trackRef}>
                {servicesData.map((service, idx) => (
                    <section
                        key={service.id}
                        className={`service-panel panel-${idx} ${service.className ? service.className : ''}`}
                    >
                        <div className="nebula-glow"></div>
                        {renderCosmicDust(gsap.utils.random(10, 18))}
                        <div className="service-content">
                            <h1>{service.title}</h1>
                            <p>{service.description}</p>
                        </div>
                    </section>
                ))}
            </div>
            <div className="services-progress-indicator">
                {servicesData.map((service) => (
                    <div key={`dot-${service.id}`} className="progress-dot" ref={addToProgressDotsRefs}></div>
                ))}
            </div>
        </div>
    );
};

export default Services;