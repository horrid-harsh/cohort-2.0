import { useEffect, useRef } from "react";

// Calls onIntersect when the target element enters the viewport
const useInfiniteScroll = (onIntersect, enabled = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { 
        threshold: 0.1,
        rootMargin: "200px", // 🔄 Pre-load contents before they hit the screen
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return ref;
};

export default useInfiniteScroll;