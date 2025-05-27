import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/TimelineV2.css';

gsap.registerPlugin(ScrollTrigger);

const TimelineV2 = () => {
    const timelineData = [
        { id: 1, title: 'Fase 1: Inmersión', description: 'Entendemos tu visión, el mercado y los usuarios finales. La base de todo gran proyecto.' },
        { id: 2, title: 'Fase 2: Conceptualización', description: 'Traducimos los insights en conceptos sólidos y estrategias de diseño y tecnología.' },
        { id: 3, title: 'Fase 3: Creación', description: 'Diseñadores y desarrolladores colaboran para construir una experiencia digital única y funcional.' },
        { id: 4, title: 'Fase 4: Refinamiento', description: 'Iteramos y probamos exhaustivamente, puliendo cada detalle para alcanzar la excelencia.' },
        { id: 5, title: 'Fase 5: Lanzamiento', description: 'Desplegamos tu proyecto al mundo y te acompañamos en su crecimiento continuo.' },
    ];

    const wrapperRef = useRef(null); // Contenedor de toda la sección de timeline
    const pinContainerRef = useRef(null); 
    const cometTrackRef = useRef(null);
    const cometHeadRef = useRef(null);

    const panelRefs = useRef([]);
    panelRefs.current = [];
    const contentRefs = useRef([]);
    contentRefs.current = [];
    const dotRefs = useRef([]);
    dotRefs.current = [];

    // Refs para limpieza
    const mainPinScrollTriggerRef = useRef(null);
    const cometScrollTriggerRef = useRef(null);
    const panelScrollTriggersRef = useRef([]);

    const addToPanelRefs = (el) => el && !panelRefs.current.includes(el) && panelRefs.current.push(el);
    const addToContentRefs = (el) => el && !contentRefs.current.includes(el) && contentRefs.current.push(el);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const pinContainer = pinContainerRef.current;
        const cometTrack = cometTrackRef.current;
        const cometHead = cometHeadRef.current;

        if (!wrapper || !pinContainer || !cometTrack || !cometHead || panelRefs.current.length === 0) {
            return;
        }

        const panels = panelRefs.current;
        const numPanels = panels.length;

        // --- Limpieza Específica ---
        if (mainPinScrollTriggerRef.current) mainPinScrollTriggerRef.current.kill();
        if (cometScrollTriggerRef.current) cometScrollTriggerRef.current.kill();
        panelScrollTriggersRef.current.forEach(st => st && st.kill());
        gsap.killTweensOf([cometTrack, cometHead, ...contentRefs.current, ...panels.filter(Boolean), ...dotRefs.current].filter(Boolean));
        mainPinScrollTriggerRef.current = null;
        cometScrollTriggerRef.current = null;
        panelScrollTriggersRef.current = [];
        panels.forEach(p => p && p.classList.remove('is-active'));
        dotRefs.current.forEach(d => d && d.classList.remove('is-active-dot'));
        // --- Fin Limpieza ---

        // Posicionamiento de Puntos
        dotRefs.current.forEach((dot, index) => {
            if (dot) {
                const yPos = (100 / numPanels) * (index + 0.5);
                dot.style.top = `${yPos}%`;
                dot.style.left = `${cometTrack.offsetLeft + (cometTrack.offsetWidth / 2)}px`;
            }
        });

        // --- Pin Principal ---
        const pinDuration = window.innerHeight * (numPanels); // Para 5 paneles, 500vh de scroll "pineado"
        
        mainPinScrollTriggerRef.current = ScrollTrigger.create({
            trigger: wrapper,
            pin: pinContainer,
            start: 'top top',
            end: () => `+=${pinDuration}`,
            invalidateOnRefresh: true,
        });


        // --- Animación del Cometa y Cabeza ---
        const cometTl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper, 
                start: 'top top', 
                end: () => `+=${pinDuration}`, 
                scrub: 1, 
                onCreate: self => cometScrollTriggerRef.current = self,
            }
        });

        cometTl.to(cometTrack, { height: '100%', ease: 'none' }, 0);
        cometTl.to(cometHead, {
            opacity: 1,
            motionPath: {
                path: [{x:0, y:0}, {x:0, y: () => pinContainer.offsetHeight - cometHead.offsetHeight / 2}],
                align: cometTrack,
                alignOrigin: [0.5, 0],
            },
            ease: 'none',
        }, 0);

        // --- Animación para cada Panel ---
        const tempPanelSTs = [];
        panels.forEach((panel, index) => {
            const content = contentRefs.current[index];
            const dot = dotRefs.current[index];
            const sectionStartPercent = (index / numPanels); 
            const sectionEndPercent = ((index + 1) / numPanels); 

            const panelST = ScrollTrigger.create({
                trigger: wrapper, 
                start: () => `top+=${sectionStartPercent * pinDuration} top`, 
                end: () => `top+=${sectionEndPercent * pinDuration} top`,     
                toggleClass: { targets: panel, className: 'is-active' }, // Muestra/oculta el panel
                onEnter: () => {
                    dotRefs.current.forEach(d => d.classList.remove('is-active-dot'));
                    if (dot) dot.classList.add('is-active-dot');
                    // Anima entrada del contenido
                    if (content) {
                        gsap.fromTo(content,
                            { opacity: 0, x: -30 },
                            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
                        );
                    }
                },
                onLeave: () => {
                    if (content) {
                        gsap.to(content, { opacity: 0, x: 30, duration: 0.3, ease: 'power2.in' });
                    }
                },
                onEnterBack: () => { 
                    dotRefs.current.forEach(d => d.classList.remove('is-active-dot'));
                    if (dot) dot.classList.add('is-active-dot');
                    if (content) {
                         gsap.fromTo(content,
                            { opacity: 0, x: 30 }, 
                            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
                        );
                    }
                },
                onLeaveBack: () => { 
                    if (content) {
                        gsap.to(content, { opacity: 0, x: -30, duration: 0.3, ease: 'power2.in' });
                    }
                },
                invalidateOnRefresh: true, // importante
            });
            tempPanelSTs.push(panelST);
        });
        panelScrollTriggersRef.current = tempPanelSTs;


        return () => {
            // Limpieza específica al desmontar
            if (mainPinScrollTriggerRef.current) mainPinScrollTriggerRef.current.kill();
            if (cometScrollTriggerRef.current) cometScrollTriggerRef.current.kill();
            panelScrollTriggersRef.current.forEach(st => st && st.kill());

            gsap.killTweensOf([wrapper, pinContainer, cometTrack, cometHead, ...panels.filter(Boolean), ...contentRefs.current, ...dotRefs.current].filter(Boolean));
            panels.forEach(p => p && p.classList.remove('is-active'));
            dotRefs.current.forEach(d => d && d.classList.remove('is-active-dot'));

            mainPinScrollTriggerRef.current = null;
            cometScrollTriggerRef.current = null;
            panelScrollTriggersRef.current = [];
        };
    }, [timelineData.length]);

    return (
        <>
            <div className="timeline-v2-intro-title">
                <h1>Nuestro Proceso Creativo</h1>
                <p>Un viaje a través de las fases de creación</p>
            </div>
            <div className="timeline-v2-wrapper" ref={wrapperRef}>
                <div className="timeline-v2-pin-container" ref={pinContainerRef}>
                    <div className="timeline-v2-comet-track" ref={cometTrackRef}>
                        <div className="comet-head" ref={cometHeadRef}></div>
                    </div>
                    {/* Eliminados los puntos visuales */}
                    {timelineData.map((item, index) => (
                        <section
                            key={item.id}
                            className="timeline-v2-panel"
                            ref={addToPanelRefs}
                        >
                            <div className="timeline-v2-content" ref={addToContentRefs}>
                                <h2>{item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TimelineV2;