import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      backgroundColor: "#fff",
      borderBottom: "1px solid #e8e4dc",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#1a1814",
            cursor: "pointer",
            fontFamily: "'Georgia', serif",
            margin: 0,
          }}
        >
          ✍️ MyBlog
        </h1>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span
            onClick={() => navigate("/")}
            style={{
              fontSize: "14px",
              cursor: "pointer",
              color: location.pathname === "/" ? "#1a1814" : "#9a8f7e",
              fontWeight: location.pathname === "/" ? "600" : "400",
              borderBottom: location.pathname === "/" ? "2px solid #1a1814" : "none",
              paddingBottom: "2px",
              transition: "color 0.2s",
            }}
          >
            Home
          </span>

          <span
            onClick={() => navigate("/create")}
            style={{
              fontSize: "14px",
              cursor: "pointer",
              color: location.pathname === "/create" ? "#1a1814" : "#9a8f7e",
              fontWeight: location.pathname === "/create" ? "600" : "400",
              borderBottom: location.pathname === "/create" ? "2px solid #1a1814" : "none",
              paddingBottom: "2px",
              transition: "color 0.2s",
            }}
          >
            Blogs
          </span>

          {/* Create Button */}
          <button
            onClick={() => navigate("/create")}
            style={{
              padding: "9px 20px",
              backgroundColor: "#1a1814",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={e => e.target.style.backgroundColor = "#3d3730"}
            onMouseLeave={e => e.target.style.backgroundColor = "#1a1814"}
          >
            + New Blog
          </button>
        </div>

      </div>
    </nav>
  );
}