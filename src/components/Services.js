import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Services.css'; // Asegúrate que la ruta es correcta

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const servicesData = [
        { id: 'web', title: 'Desarrollo Web', description: 'Creamos sitios web modernos, responsivos y optimizados para tus necesidades.', className: 'service-web' },
        { id: 'audit', title: 'Auditoría', description: 'Analizamos tu presencia online para identificar oportunidades y mejorar tu rendimiento.', className: 'service-audit' },
        { id: 'marketing', title: 'Marketing', description: 'Estrategias de marketing digital efectivas para alcanzar tus objetivos y conectar con tu audiencia.', className: 'service-marketing' },
        { id: 'design', title: 'Diseño Gráfico', description: 'Identidad visual impactante y diseños creativos que comunican tu marca.', className: 'service-design' },
    ];

    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // Refs para limpieza
    const mainTweenRef = useRef(null);
    const mainScrollTriggerInstanceRef = useRef(null); // Para el ST del tween principal
    const panelAnimationsRef = useRef([]); // Para tweens de paneles
    const panelScrollTriggersRef = useRef([]); // Para ST de paneles si se crean con ScrollTrigger.create()

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;

        if (!container || !track) {
            console.warn('Services component: Container or track ref not available.');
            return;
        }

        const panels = Array.from(track.children);
        if (panels.length === 0) {
            console.warn('Services component: No panels found in track.');
            return;
        }

        // --- Limpieza de animaciones y ST anteriores específicos de ESTE componente ---
        if (mainScrollTriggerInstanceRef.current) {
            mainScrollTriggerInstanceRef.current.kill();
            mainScrollTriggerInstanceRef.current = null;
        }
        if (mainTweenRef.current) {
            mainTweenRef.current.kill(); // Matar el tween también mata su ST asociado
            mainTweenRef.current = null;
        }
        panelScrollTriggersRef.current.forEach(st => {
            if (st) st.kill();
        });
        panelScrollTriggersRef.current = [];
        panelAnimationsRef.current.forEach(anim => {
            if (anim) anim.kill(); // Matar el tween también mata su ST asociado
        });
        panelAnimationsRef.current = [];
        // --- Fin de la limpieza ---

        const amountToScroll = -100 * (panels.length - 1);

        const mainTween = gsap.to(track, {
            xPercent: amountToScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                snap: {
                    snapTo: 1 / (panels.length - 1),
                    duration: { min: 0.2, max: 0.4 },
                    delay: 0,
                    ease: 'power1.inOut',
                },
                end: () => `+=${container.offsetWidth * (panels.length - 1)}`,
                invalidateOnRefresh: true,
                // markers: true, // Descomenta para depurar
                onCreate: self => mainScrollTriggerInstanceRef.current = self, // Guardar instancia de ST
            },
        });
        mainTweenRef.current = mainTween; // Guardar el tween principal

        const tempPanelAnims = [];

        panels.forEach((panel, index) => {
            const content = panel.querySelector('.service-content');
            if (content) {
                const panelAnim = gsap.to(content, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: mainTween,
                        start: "left 75%",
                        toggleActions: "play none none reverse",
                        // markers: {startColor: "cyan", endColor: "pink", indent: 40 * (index + 1)},
                        // No necesitamos onCreate aquí si el ST se mata con el tween 'panelAnim'
                    }
                });
                tempPanelAnims.push(panelAnim);
            }
        });
        panelAnimationsRef.current = tempPanelAnims;
        // panelScrollTriggersRef.current = tempPanelSTs; // Solo si creas ST con ScrollTrigger.create()

        return () => {
            // Limpieza específica al desmontar
            if (mainScrollTriggerInstanceRef.current) {
                mainScrollTriggerInstanceRef.current.kill();
                mainScrollTriggerInstanceRef.current = null;
            }
            if (mainTweenRef.current) {
                mainTweenRef.current.kill();
                mainTweenRef.current = null;
            }
            panelScrollTriggersRef.current.forEach(st => {
                if (st) st.kill();
            });
            panelScrollTriggersRef.current = [];
            panelAnimationsRef.current.forEach(anim => {
                if (anim) anim.kill();
            });
            panelAnimationsRef.current = [];

            // Limpiar tweens de elementos si es necesario, aunque matar el tween debería ser suficiente
            // gsap.killTweensOf(track);
            // panels.forEach(p => {
            //     const c = p.querySelector('.service-content');
            //     if (c) gsap.killTweensOf(c);
            // });
        };
    }, [servicesData.length]);

    return (
        <div className="services-container" ref={containerRef}>
            <div className="services-track" ref={trackRef}>
                {servicesData.map((service) => (
                    <section
                        key={service.id}
                        className={`service-panel ${service.className}`}
                    >
                        <div className="service-content">
                            <h1>{service.title}</h1>
                            <p>{service.description}</p>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Services;