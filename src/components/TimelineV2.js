// TimelineV2.js
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
        { id: 5, title: 'Fase 5: Lanzamiento Épico', description: 'Desplegamos tu proyecto al mundo y te acompañamos en su crecimiento continuo.' },
    ];

    const wrapperRef = useRef(null); // Contenedor de toda la sección de timeline
    const pinContainerRef = useRef(null); // El que se va a pinear (100vh)
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
    const addToDotRefs = (el) => el && !dotRefs.current.includes(el) && dotRefs.current.push(el);

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
        // El pin durará lo suficiente para pasar por todos los paneles.
        // Cada panel "ocupa" 100vh de scroll.
        const pinDuration = window.innerHeight * (numPanels); // Para 5 paneles, 500vh de scroll "pineado"
        
        mainPinScrollTriggerRef.current = ScrollTrigger.create({
            trigger: wrapper,
            pin: pinContainer,
            start: 'top top',
            end: () => `+=${pinDuration}`,
            // markers: {startColor: "green", endColor: "red", indent:0}, // 
            invalidateOnRefresh: true,
        });


        // --- Animación del Cometa y Cabeza ---
        // Esta animación se controla por el scroll a través de todo el `wrapper`
        // desde que empieza el pin hasta que termina.
        const cometTl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper, // O podría ser pinContainer si el wrapper no tiene más altura
                start: 'top top', // Cuando el wrapper (o pinContainer) llega al top
                end: () => `+=${pinDuration}`, // Misma duración que el pin
                scrub: 1, // Suaviza con el scroll
                // markers: {startColor: "blue", endColor: "orange", indent: 40}, // Marcador para el cometa
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

            // Cada panel se activará en un punto diferente del scroll.
            // Dividimos la duración total del pin entre el número de paneles.
            // El primer panel se activa al inicio, el segundo después de 1* (pinDuration/numPanels) de scroll, etc.
            // El 'start' es relativo al 'start' del ScrollTrigger del pin principal.
            
            // La 'ventana de activación' para cada panel.
            // ej: panel 0: 0% a 20% del scroll total del pin
            //     panel 1: 20% a 40% del scroll total del pin
            const sectionStartPercent = (index / numPanels); // 0, 0.2, 0.4...
            const sectionEndPercent = ((index + 1) / numPanels); // 0.2, 0.4, 0.6...

            const panelST = ScrollTrigger.create({
                trigger: wrapper, // El trigger general, no el panel en sí para este ST
                start: () => `top+=${sectionStartPercent * pinDuration} top`, // Cuando empieza la "sección" de este panel
                end: () => `top+=${sectionEndPercent * pinDuration} top`,     // Cuando termina la "sección" de este panel
                // markers: {startColor: `hsl(${index*60}, 100%, 50%)`, endColor: `hsl(${index*60}, 100%, 50%)`, indent: 80 + index*20 },
                toggleClass: { targets: panel, className: 'is-active' }, // Muestra/oculta el panel
                onEnter: () => {
                    dotRefs.current.forEach(d => d.classList.remove('is-active-dot'));
                    if (dot) dot.classList.add('is-active-dot');
                    // Animar entrada del contenido
                    if (content) {
                        gsap.fromTo(content,
                            { opacity: 0, x: -30 },
                            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
                        );
                    }
                },
                onLeave: () => {
                    // Opcional: animar salida del contenido
                    if (content) {
                        gsap.to(content, { opacity: 0, x: 30, duration: 0.3, ease: 'power2.in' });
                    }
                },
                onEnterBack: () => { // Cuando se scrollea hacia atrás y se entra en la sección del panel
                    dotRefs.current.forEach(d => d.classList.remove('is-active-dot'));
                    if (dot) dot.classList.add('is-active-dot');
                    if (content) {
                         gsap.fromTo(content,
                            { opacity: 0, x: 30 }, // Entra desde la derecha si es hacia atrás
                            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
                        );
                    }
                },
                onLeaveBack: () => { // Cuando se scrollea hacia atrás y se sale de la sección del panel
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
                <h1>Nuestro Proceso Cósmico</h1>
                <p>Un viaje a través de las fases de creación, donde cada estrella es un hito.</p>
            </div>
            <div className="timeline-v2-wrapper" ref={wrapperRef}>
                <div className="timeline-v2-pin-container" ref={pinContainerRef}> {/* 100vh, pinned */}
                    <div className="timeline-v2-comet-track" ref={cometTrackRef}>
                        <div className="comet-head" ref={cometHeadRef}></div>
                    </div>
                    {timelineData.map((item, index) => (
                        <div key={`dot-${item.id}`} ref={addToDotRefs} className="timeline-v2-dot"></div>
                    ))}
                    {/* Los paneles se superponen aquí dentro de pinContainer */}
                    {timelineData.map((item, index) => (
                        <section
                            key={item.id}
                            className="timeline-v2-panel" // CSS maneja opacity/visibility con .is-active
                            ref={addToPanelRefs}
                            // style={{zIndex: numPanels - index}} // Para el orden si es necesario
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