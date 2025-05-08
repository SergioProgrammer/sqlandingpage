import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Services.css'; 

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const servicesData = [
        { id: 'web', title: 'Desarrollo Web', description: 'Creamos sitios web modernos, responsivos y optimizados para tus necesidades.', className: 'service-web', shape1Color: 'rgba(0, 191, 255, 0.08)', shape2Color: 'rgba(0, 150, 255, 0.06)' },
        { id: 'audit', title: 'Auditoría', description: 'Analizamos tu presencia online para identificar oportunidades y mejorar tu rendimiento.', className: 'service-audit', shape1Color: 'rgba(138, 43, 226, 0.08)', shape2Color: 'rgba(100, 30, 180, 0.06)' },
        { id: 'marketing', title: 'Marketing Digital', description: 'Estrategias de marketing digital efectivas para alcanzar tus objetivos y conectar con tu audiencia.', className: 'service-marketing', shape1Color: 'rgba(255, 100, 0, 0.08)', shape2Color: 'rgba(255, 150, 50, 0.06)' },
        { id: 'design', title: 'Diseño Gráfico', description: 'Identidad visual impactante y diseños creativos que comunican tu marca.', className: 'service-design', shape1Color: 'rgba(0, 200, 150, 0.08)', shape2Color: 'rgba(0, 180, 120, 0.06)' },
    ];

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const progressDotsRef = useRef([]);
    progressDotsRef.current = [];

    const mainTweenRef = useRef(null);
    const mainScrollTriggerInstanceRef = useRef(null);
    const panelContentTimelinesRef = useRef([]);
    const parallaxTweensRef = useRef([]);

    const addToProgressDotsRefs = (el) => el && !progressDotsRef.current.includes(el) && progressDotsRef.current.push(el);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const currentTrack = trackRef.current;

        if (!currentContainer || !currentTrack) return;

        const panelsNodeList = currentTrack.children; 
        const panels = Array.from(panelsNodeList); 
        if (panels.length === 0) return;

        // --- Limpieza (como en la versión anterior, asegurando que todo se mate) ---
        const cleanup = () => {
            if (mainScrollTriggerInstanceRef.current) mainScrollTriggerInstanceRef.current.kill();
            if (mainTweenRef.current) mainTweenRef.current.kill();
            panelContentTimelinesRef.current.forEach(tl => tl && tl.kill());
            parallaxTweensRef.current.forEach(tween => tween && tween.kill());

            mainScrollTriggerInstanceRef.current = null;
            mainTweenRef.current = null;
            panelContentTimelinesRef.current = [];
            parallaxTweensRef.current = [];
            progressDotsRef.current.forEach(dot => dot && dot.classList.remove('is-active'));

            panels.forEach(panel => {
                const title = panel.querySelector('.service-content h1');
                const paragraph = panel.querySelector('.service-content p');
                const shapes = panel.querySelectorAll('.decorative-shape');

                if (title) gsap.set(title, { clearProps: "all" }); 
                if (paragraph) gsap.set(paragraph, { clearProps: "all" });
                shapes.forEach(shape => gsap.set(shape, { clearProps: "all" }));
            });
             if(currentTrack) gsap.set(currentTrack, {clearProps: "all"});
        };
        cleanup();
        // --- Fin Limpieza ---


        const amountToScroll = -100 * (panels.length - 1);
        let createdMainST = null;

        const newMainTween = gsap.to(currentTrack, {
            xPercent: amountToScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: currentContainer,
                pin: true,
                scrub: 1.2,
                snap: {
                    snapTo: 1 / (panels.length - 1),
                    duration: { min: 0.3, max: 0.6 },
                    delay: 0.05,
                    ease: 'power2.inOut',
                },
                end: () => `+=${currentContainer.offsetWidth * (panels.length - 1) * 1.5}`,
                invalidateOnRefresh: true,
                markers: false, 
                onCreate: self => createdMainST = self,
                onUpdate: self => {
                    const progress = Math.round(self.progress * (panels.length - 1));
                    progressDotsRef.current.forEach((dot, index) => {
                        if (dot) dot.classList.toggle('is-active', index === progress);
                    });
                },
            },
        });
        mainTweenRef.current = newMainTween;
        mainScrollTriggerInstanceRef.current = createdMainST;

        const tempContentTLs = [];
        const tempParallaxTweens = [];

        panels.forEach((panelElement, index) => { 
            const title = panelElement.querySelector('.service-content h1');
            const paragraph = panelElement.querySelector('.service-content p');
            const shapes = panelElement.querySelectorAll('.decorative-shape');

          
            if (title && paragraph) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: panelElement,
                        containerAnimation: newMainTween,
                        start: 'left 70%', 
                        end: 'right 30%',
                        toggleActions: 'play reverse play reverse',
                    }
                });

                tl.fromTo(title,
                    { autoAlpha: 0, y: 60, skewX: -10 }, 
                    { autoAlpha: 1, y: 0, skewX: 0, duration: 0.8, ease: 'power3.out' } 
                )
                .fromTo(paragraph,
                    { autoAlpha: 0, y: 40 },
                    { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
                    "-=0.5" // Empezar un poco antes de que termine la del título
                );
                tempContentTLs.push(tl);
            } else {
                console.warn(`Panel ${index}: Title or Paragraph not found.`);
            }

            shapes.forEach((shape, shapeIndex) => {
                const parallaxTween = gsap.to(shape, {
                    x: () => gsap.utils.random(-60, 60) * (shapeIndex % 2 === 0 ? -1 : 1), 
                    y: () => gsap.utils.random(-40, 40),
                    rotation: () => gsap.utils.random(-25, 25),
                    scale: () => gsap.utils.random(0.8, 1.2), 
                    opacity: () => gsap.utils.random(0.5, 1), 
                    ease: 'none',
                    scrollTrigger: {
                        trigger: panelElement,
                        containerAnimation: newMainTween,
                        scrub: 2, 
                        start: 'left right', 
                        end: 'right left',   
                    }
                });
                tempParallaxTweens.push(parallaxTween);
            });
        });
        panelContentTimelinesRef.current = tempContentTLs;
        parallaxTweensRef.current = tempParallaxTweens;

        if (progressDotsRef.current[0]) {
            progressDotsRef.current[0].classList.add('is-active');
        }

        return cleanup;

    }, [servicesData.length]);

    return (
        <div className="services-container" ref={containerRef}>
            <div className="services-track" ref={trackRef}>
                {servicesData.map((service, index) => (
                    <section
                        key={service.id}
                        className={`service-panel ${service.className}`}
                    >
                        <div className="decorative-shape shape-1" style={{ backgroundColor: service.shape1Color }}></div>
                        <div className="decorative-shape shape-2" style={{ backgroundColor: service.shape2Color }}></div>

                        <div className="service-content">
                            
                            <h1>{service.title}</h1>
                            <p>{service.description}</p>
                        </div>
                    </section>
                ))}
            </div>
            <div className="services-progress-indicator">
                {servicesData.map((service, index) => (
                    <div key={`dot-${service.id}`} className="progress-dot" ref={addToProgressDotsRefs}></div>
                ))}
            </div>
        </div>
    );
};

export default Services;