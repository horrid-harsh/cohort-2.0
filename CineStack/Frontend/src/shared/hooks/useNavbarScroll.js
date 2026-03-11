import { useState, useEffect, useRef } from "react";

const useNavbarScroll = (threshold = 50) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at top
      setIsAtTop(currentScrollY < threshold);

      // Determine visibility based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isVisible, isAtTop };
};

export default useNavbarScroll;
