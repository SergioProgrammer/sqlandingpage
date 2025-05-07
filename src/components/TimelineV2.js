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

    const wrapperRef = useRef(null);
    const pinContainerRef = useRef(null);
    const cometTrackRef = useRef(null);
    const cometHeadRef = useRef(null);

    const panelRefs = useRef([]);
    panelRefs.current = [];
    const contentRefs = useRef([]);
    contentRefs.current = [];
    const dotRefs = useRef([]);
    dotRefs.current = [];

    const masterTimelineRef = useRef(null);
    const masterScrollTriggerInstanceRef = useRef(null);

    const addToPanelRefs = (el) => el && !panelRefs.current.includes(el) && panelRefs.current.push(el);
    const addToContentRefs = (el) => el && !contentRefs.current.includes(el) && contentRefs.current.push(el);
    const addToDotRefs = (el) => el && !dotRefs.current.includes(el) && dotRefs.current.push(el);

    useEffect(() => {
        // --- Asegurarse de que los elementos están listos ---
        const wrapper = wrapperRef.current;
        const pinContainer = pinContainerRef.current;
        const cometTrack = cometTrackRef.current;
        const cometHead = cometHeadRef.current;

        if (!wrapper || !pinContainer || !cometTrack || !cometHead || panelRefs.current.length === 0) {
            console.warn("TimelineV2: Elementos esenciales no encontrados al inicio del useEffect.");
            return;
        }

        const panels = panelRefs.current;
        const numPanels = panels.length;

        // --- Limpieza específica ---
        if (masterScrollTriggerInstanceRef.current) masterScrollTriggerInstanceRef.current.kill();
        if (masterTimelineRef.current) masterTimelineRef.current.kill();
        gsap.killTweensOf([cometTrack, cometHead, ...contentRefs.current, ...dotRefs.current, ...panels].filter(Boolean));
        panelRefs.current.forEach(p => p && p.classList.remove('is-active'));
        dotRefs.current.forEach(d => {
            if (d) {
                d.classList.remove('is-active-dot');
                d.style.cssText = ''; // Resetear estilos inline
            }
        });
        masterScrollTriggerInstanceRef.current = null;
        masterTimelineRef.current = null;
        // --- Fin limpieza específica ---


        // --- Posicionamiento de Puntos ---
        dotRefs.current.forEach((dot, index) => {
            if (dot) {
                const yPos = (100 / numPanels) * (index + 0.5);
                dot.style.top = `${yPos}%`;
                dot.style.left = `${cometTrack.offsetLeft + (cometTrack.offsetWidth / 2)}px`;
                dot.style.opacity = '0.5'; // Estado inicial
            }
        });

        // --- Ocultar todos los paneles excepto el primero al inicio ---
        // (Si no se superponen con CSS, esto no es estrictamente necesario, pero no hace daño)
        panels.forEach((panel, index) => {
            if (panel) {
                gsap.set(panel, { autoAlpha: index === 0 ? 1 : 0 });
                 // Asegurar que el contenido también esté en su estado inicial correcto
                if (contentRefs.current[index]) {
                    gsap.set(contentRefs.current[index], { opacity: index === 0 ? 1: 0, x: index === 0 ? 0 : -30 });
                }
            }
        });
         if (dotRefs.current[0]) dotRefs.current[0].classList.add('is-active-dot');
         if (panelRefs.current[0]) panelRefs.current[0].classList.add('is-active');


        // --- Definición de la Animación Principal ---
        // Cada panel "dura" 1 unidad de tiempo en la masterTimeline.
        // La duración total del scroll será `alturaVentana * (numPanels - 1)`
        // porque el primer panel ya es visible.
        const scrollDistanceToEnd = window.innerHeight * (numPanels > 1 ? numPanels -1 : 1);


        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                pin: pinContainer,
                scrub: 1, // O un valor numérico para más suavidad
                start: 'top top',
                end: () => `+=${scrollDistanceToEnd}`, // Distancia de scroll para pasar por todos los paneles
                markers: false, // ¡MUY IMPORTANTE PARA DEPURAR!
                invalidateOnRefresh: true,
                onCreate: self => masterScrollTriggerInstanceRef.current = self,
            },
        });
        masterTimelineRef.current = masterTl;

       // --- Animación del Cometa por pasos ---
        gsap.set(cometHead, { opacity: 1 }); // Mostrar desde el principio

        // Comet Track height animado por tramos
        masterTl.to(cometTrack, {
            keyframes: Array.from({ length: numPanels }, (_, i) => ({
                height: `${((i + 1) / numPanels) * 100}%`,
                duration: 1,
                ease: 'none',
            })),
        }, 0);

        // Comet Head movimiento vertical sincronizado
        masterTl.to(cometHead, {
            keyframes: Array.from({ length: numPanels }, (_, i) => ({
                y: () => `${((i + 1) / numPanels) * pinContainer.offsetHeight - cometHead.offsetHeight / 2}px`,
                duration: 1,
                ease: 'none',
            })),
        }, 0);



        // --- Animaciones de Transición entre Paneles ---
        // Vamos a hacer que cada panel tenga su "tiempo" en la timeline.
        // Si la masterTl dura X en scroll, y tenemos N paneles, cada panel
        // "ocupa" X/N de ese scroll.
        // La masterTl por defecto no tiene una duración explícita, se basa en sus tweens.
        // Vamos a darle una duración implícita con labels o offsets.

        for (let i = 0; i < numPanels; i++) {
            const currentPanel = panels[i];
            const currentContent = contentRefs.current[i];
            const currentDot = dotRefs.current[i];
            const nextPanel = panels[i + 1];

            // Label para el inicio de la sección de este panel
            masterTl.addLabel(`panel-${i}-start`);

            // Activar el dot y panel actual (reafirmar para el primero, activar para los siguientes)
            masterTl.add(() => {
                dotRefs.current.forEach(d => d.classList.remove('is-active-dot'));
                if (currentDot) currentDot.classList.add('is-active-dot');
                panelRefs.current.forEach(p => p.classList.remove('is-active'));
                if (currentPanel) currentPanel.classList.add('is-active');
            });

            // Si no es el primer panel, animar su aparición (ya que estaba oculto)
            if (i > 0 && currentPanel && currentContent) {
                masterTl.to(currentPanel, { autoAlpha: 1, duration: 0.01 }); // Hacer visible el panel
                masterTl.fromTo(currentContent,
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
                    ">-0.01" // Un poco después de que el panel sea visible
                );
            } else if (i === 0 && currentPanel && currentContent) {
                 // Para el primer panel, aseguramos que esté visible y su contenido animado si es necesario
                 // Esto ya se hizo con gsap.set, pero para consistencia si se quiere una animación de entrada.
                masterTl.to(currentPanel, { autoAlpha: 1, duration: 0.01 });
                // Si queremos una animación de entrada para el primer contenido:
                // masterTl.fromTo(currentContent, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
            }


            // Si hay un panel siguiente, preparar la transición
            if (nextPanel) {
                // Añadir un "espacio" o duración para que este panel esté visible
                // antes de transicionar al siguiente.
                // La duración de este "espacio" se distribuirá a lo largo del scroll total.
                // Cada "paso" entre paneles tomará 1/ (numPanels - 1) del progreso total de la timeline.
                masterTl.to({}, { duration: 1 }); // Esta duración es relativa a la longitud total del scroll

                // Desvanecer el panel actual y su contenido ANTES de mostrar el siguiente
                if(currentContent) {
                    masterTl.to(currentContent, {
                        opacity: 0,
                        x: 30,
                        duration: 0.3,
                        ease: 'power2.in',
                    });
                }
                masterTl.to(currentPanel, { autoAlpha: 0, duration: 0.01 }, ">-0.2"); // Ocultar panel un poco después de que el contenido empiece a salir

            } else {
                // Es el último panel, simplemente dejarlo visible
                masterTl.to({}, { duration: 1 }); // Darle su "tiempo" de visibilidad
            }
        }


        return () => {
            if (masterScrollTriggerInstanceRef.current) masterScrollTriggerInstanceRef.current.kill();
            if (masterTimelineRef.current) masterTimelineRef.current.kill();
            gsap.killTweensOf([wrapper, pinContainer, cometTrack, cometHead, ...panels, ...contentRefs.current, ...dotRefs.current].filter(Boolean));
            panelRefs.current.forEach(p => p && p.classList.remove('is-active'));
            dotRefs.current.forEach(d => {
                 if(d) {
                    d.classList.remove('is-active-dot');
                    d.style.cssText = '';
                 }
            });
            masterScrollTriggerInstanceRef.current = null;
            masterTimelineRef.current = null;
        };
    }, [timelineData.length]); // Rehacer si cambia el número de items

    return (
        <>
            <div className="timeline-v2-intro-title">
                <h1>Nuestro Proceso Cósmico</h1>
                <p>Un viaje a través de las fases de creación, donde cada estrella es un hito.</p>
            </div>
            <div className="timeline-v2-wrapper" ref={wrapperRef}>
                <div className="timeline-v2-pin-container" ref={pinContainerRef}>
                    <div className="timeline-v2-comet-track" ref={cometTrackRef}>
                        <div className="comet-head" ref={cometHeadRef}></div>
                    </div>
                    {timelineData.map((item, index) => (
                        <div
                            key={`dot-${item.id}`}
                            ref={addToDotRefs}
                            className="timeline-v2-dot"
                        ></div>
                    ))}
                    <div className="timeline-v2-panels-container">
                        {timelineData.map((item, index) => (
                            <section
                                key={item.id}
                                className="timeline-v2-panel"
                                ref={addToPanelRefs}
                                style={{
                                    // Para asegurar que inicialmente solo el primero sea visible si se superponen
                                    // y GSAP maneja la opacidad.
                                    // autoAlpha: index === 0 ? 1 : 0 // GSAP lo manejará
                                }}
                            >
                                <div className="timeline-v2-content" ref={addToContentRefs}>
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimelineV2;