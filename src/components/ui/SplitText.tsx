'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

/**
 * Componente de título com animação simples e suave de fade-in ao entrar na tela.
 * Mantém o texto 100% íntegro, com espaçamento nativo e legível para usuários e motores de busca.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.7,
  ease = 'power2.out',
  threshold = 0.1,
  rootMargin = '-30px',
  tag = 'h2',
  textAlign,
  onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          setInView(true);
          gsap.fromTo(
            el,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration,
              delay: (delay || 0) / 1000,
              ease,
              onComplete: () => {
                onLetterAnimationComplete?.();
              }
            }
          );
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay, duration, ease, onLetterAnimationComplete]);

  const Tag = tag;

  return (
    <Tag
      ref={containerRef as any}
      style={{
        textAlign,
        opacity: !mounted || inView ? 1 : 0,
        transform: !mounted || inView ? 'translateY(0)' : 'translateY(15px)',
        willChange: 'opacity, transform'
      }}
      className={`inline-block ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
