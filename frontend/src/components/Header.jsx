function Header() {
  return (
    <header
      style={{
        marginBottom: "30px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          color: "#f8fafc",
        }}
      >
        TaskForge
      </h1>

      <p
        style={{
          margin: "7px 0 0",
          color: "#94a3b8",
          fontSize: "15px",
        }}
      >
        Manage your tasks. Stay productive.
      </p>
    </header>
  );
}

export default Header;