import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout({ children }) {
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

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;