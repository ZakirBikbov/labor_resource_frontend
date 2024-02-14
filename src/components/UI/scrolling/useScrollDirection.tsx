import { useState, useEffect } from 'react';
type ScrollDirection = 'up' | 'down' | null;

const useScrollDirection = (): ScrollDirection => {
    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction: ScrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 4) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', updateScrollDirection);

        return () => {
            window.removeEventListener('scroll', updateScrollDirection);
        };
    }, [scrollDirection]);

    return scrollDirection;
};

export default useScrollDirection;