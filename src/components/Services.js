import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const servicesData = [
        {
            id: 'creatividad',
            title: 'Creatividad',
            description: 'Desde conceptos visuales hasta campañas, creamos lo que conecta e impacta',
            images: ['creatividad1.svg', 'creatividad2.svg', 'creatividad3.svg']
        },
        {
            id: 'estrategia',
            title: 'Estrategia',
            description: 'Investigamos tu sector, entendemos tu marca y diseñamos un plan sólido enfocado en resultados',
            images: ['Estartegia.svg',]
        },
        {
            id: 'branding',
            title: 'Branding',
            description: 'Diseñamos tu identidad visual, verbal y emocional para que transmita lo que realmente eres',
            images: ['Branding1.svg', 'Branding2.svg', 'Branding3.svg']
        },
        {
            id: 'desarrollo',
            title: 'Desarrollo',
            description: 'Creamos sitios web, e-commerce inmersivos como este, que no solo funcionan, sino que enamoran',
            images: ['Desarrollo1.svg', 'Desarrollo2.svg', 'Desarrollo3.svg']
        }
    ];

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const mainTweenRef = useRef(null);
    const panelAnimationsRef = useRef([]);
    const imageRefs = useRef([]);

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

        // Efecto 3D inmersivo para cada imagen de cada panel
        imageRefs.current.forEach((imgArr, idx) => {
            if (!imgArr) return;
            gsap.set(imgArr, { autoAlpha: 0, y: 80, scale: 1.15, rotateY: -25 });
            gsap.to(imgArr, {
                scrollTrigger: {
                    trigger: panels[idx],
                    containerAnimation: mainTweenRef.current,
                    start: 'left 70%',
                    end: 'right 30%',
                    scrub: true
                },
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotateY: 0,
                stagger: 0.18,
                ease: "expo.out"
            });
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
                        <div className="service-img-3d-wrapper">
                            {service.images.map((img, imgIdx) => (
                                <img
                                    key={img}
                                    src={`/img/${img}`}
                                    alt={service.title}
                                    className="service-img-3d"
                                    ref={el => {
                                        if (!imageRefs.current[idx]) imageRefs.current[idx] = [];
                                        imageRefs.current[idx][imgIdx] = el;
                                    }}
                                />
                            ))}
                        </div>
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