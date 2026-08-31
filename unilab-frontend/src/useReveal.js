import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------
   Hook: fade/rise a card in once it crosses the viewport,
   staggered by its index within the grid (mirrors script.js)
------------------------------------------------------------------- */

export function useReveal(count) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(() => Array(count).fill(false));
  refs.current = [];

  const register = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 90}ms`;
          setVisible((v) => {
            const next = [...v];
            next[index] = true;
            return next;
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  return { register, visible };
}