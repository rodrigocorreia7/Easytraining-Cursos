'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
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
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  // Keep the server-rendered heading readable; animate only after hydration.
  const words = useMemo(() => {
    return text.split(' ');
  }, [text]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!mounted || !el) return;

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
  }, [mounted, threshold, rootMargin]);

  useEffect(() => {
    if (!inView || !containerRef.current || animatedRef.current) return;

    animatedRef.current = true;
    const el = containerRef.current;
    const targets = el.querySelectorAll('.split-unit');

    if (targets.length === 0) return;

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
  }, [inView, delay, duration, ease, from, to, onLetterAnimationComplete]);

  const Tag = tag;

  if (!mounted) {
    return (
      <Tag
        ref={containerRef as any}
        style={{ textAlign, wordWrap: 'break-word' }}
        className={`split-parent overflow-visible inline-block whitespace-normal pb-1.5 pt-0.5 ${className}`}
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef as any}
      style={{ textAlign, wordWrap: 'break-word' }}
      className={`split-parent overflow-visible inline-block whitespace-normal pb-1.5 pt-0.5 ${className}`}
    >
      <span className="inline overflow-visible">
        {words.map((word, wordIndex) => (
          <span
            key={`word-${wordIndex}`}
            className="split-unit split-word inline-block whitespace-nowrap overflow-visible"
            style={{
              opacity: inView ? 1 : (typeof from?.opacity === 'number' ? from.opacity : 0),
              transform: inView ? 'translateY(0)' : `translateY(${typeof from?.y === 'number' ? from.y : 35}px)`
            }}
          >
            {word}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default SplitText;
