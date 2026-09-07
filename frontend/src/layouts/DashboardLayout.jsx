import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout({ children }) {
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
    <div
      className="app"
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#0f1117",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          padding: "32px",
          overflowY: "auto",
          background: "#0f1117",
        }}
      >
        <Header />

        {/* Page transition */}
        <div ref={pageRef}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;