import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

function PageTransition({ children }) {
  const pageRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, [location.pathname]);

  return (
    <div ref={pageRef}>
      {children}
    </div>
  );
}

export default PageTransition;