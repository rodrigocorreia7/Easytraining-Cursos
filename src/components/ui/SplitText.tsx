'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: Record<string, any>;
  to?: Record<string, any>;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  duration = 1.0,
  ease = 'power3.out',
  splitType = 'words, chars',
  from = { opacity: 0, y: 35 },
  to = { opacity: 1, y: 0 },
  threshold = 0.15,
  rootMargin = '-50px',
  tag = 'h2',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);
  const [inView, setInView] = useState(false);

  // Split text into words and chars
  const words = useMemo(() => {
    return text.split(' ');
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (!inView || !containerRef.current || animatedRef.current) return;

    animatedRef.current = true;
    const el = containerRef.current;
    const targets = el.querySelectorAll('.split-char');

    if (targets.length === 0) return;

    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        targets,
        {
          ...from,
          display: 'inline-block',
          willChange: 'transform, opacity'
        },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: () => {
            onLetterAnimationComplete?.();
          }
        }
      );
    }).catch(() => {});
  }, [inView, delay, duration, ease, from, to, onLetterAnimationComplete]);

  const Tag = tag;

  return (
    <Tag
      ref={containerRef as any}
      style={{ textAlign, wordWrap: 'break-word' }}
      className={`split-parent overflow-visible inline-block whitespace-normal pb-1.5 pt-0.5 ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline overflow-visible">
        {words.map((word, wordIndex) => (
          <span
            key={`word-${wordIndex}`}
            className="split-word inline-block whitespace-nowrap mr-[0.28em] last:mr-0 overflow-visible"
          >
            {word.split('').map((char, charIndex) => (
              <span
                key={`char-${wordIndex}-${charIndex}`}
                className="split-char inline-block overflow-visible align-baseline"
                style={{
                  opacity: inView ? 1 : (typeof from?.opacity === 'number' ? from.opacity : 0),
                  transform: inView ? 'translateY(0)' : `translateY(${typeof from?.y === 'number' ? from.y : 35}px)`
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default SplitText;
