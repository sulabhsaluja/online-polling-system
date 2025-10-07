import { useEffect, useRef, useState } from 'react';

// Utility function to safely add/remove multiple CSS classes
const toggleClasses = (element, classString, add = true) => {
  if (!element || !classString) return;
  
  const classes = classString.split(' ').filter(cls => cls.trim() !== '');
  classes.forEach(cls => {
    if (add) {
      element.classList.add(cls);
    } else {
      element.classList.remove(cls);
    }
  });
};

// Custom hook for intersection observer animations
export const useIntersectionAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef();

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationClass = 'animate-fade-in-up'
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !hasAnimated) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    toggleClasses(element, animationClass, isVisible);
  }, [isVisible, animationClass]);

  return [elementRef, isVisible];
};

// Custom hook for staggered animations
export const useStaggeredAnimation = (items = [], delay = 100, animationClass = 'animate-fade-in-up') => {
  const [animatedItems, setAnimatedItems] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    items.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedItems(prev => new Set([...prev, index]));
      }, index * delay);
    });
  }, [isVisible, items.length, delay]);

  const getItemProps = (index) => {
    const baseClasses = animatedItems.has(index) ? animationClass : 'opacity-0';
    return {
      className: baseClasses,
      style: {
        animationDelay: `${index * delay}ms`
      }
    };
  };

  return [containerRef, getItemProps];
};

// Custom hook for hover animations
export const useHoverAnimation = (animationClass = 'animate-bounce') => {
  const elementRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      toggleClasses(element, animationClass, true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      toggleClasses(element, animationClass, false);
    };

    const handleAnimationEnd = () => {
      if (!isHovered) {
        toggleClasses(element, animationClass, false);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('animationend', handleAnimationEnd);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [animationClass, isHovered]);

  return [elementRef, isHovered];
};

// Custom hook for scroll-based animations
export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return { scrollY, isScrolling };
};

// Custom hook for typewriter effect
export const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    setIsComplete(false);

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Custom hook for particle cursor effect
export const useParticleCursor = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newParticle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        life: 20,
        size: Math.random() * 5 + 2,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        opacity: 1
      };

      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          opacity: particle.life / 20
        })).filter(particle => particle.life > 0)
      );
    };

    const animationInterval = setInterval(animateParticles, 16);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(animationInterval);
    };
  }, []);

  return particles;
};

// Loading animation hook
export const useLoadingAnimation = (isLoading, minDuration = 500) => {
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, minDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration]);

  return showLoading;
};
