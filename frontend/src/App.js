// import React from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import LandingPage from "./LandingPage";
// import AdminPanel from "./AdminPanel";

// function App() {
//   return (
//     <BrowserRouter>
//       <header style={{ background: "#111827", color: "#fff" }}>
//         <div
//           className="main-container"
//           style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
//         >
//           <Link
//             to="/"
//             style={{ fontWeight: "bold", textDecoration: "none", color: "#fff", fontSize: "1.1rem" }}
//           >
//             Creative Agency
//           </Link>
//           <nav style={{ display: "flex", gap: "1rem" }}>
//             <Link to="/" style={{ textDecoration: "none", color: "#e5e7eb", fontSize: "0.95rem" }}>
//               Home
//             </Link>
//             <Link to="/admin" style={{ textDecoration: "none", color: "#e5e7eb", fontSize: "0.95rem" }}>
//               Admin
//             </Link>
//           </nav>
//         </div>
//       </header>

//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/admin" element={<AdminPanel />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import AdminPanel from "./AdminPanel";

function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header style={{ borderBottom: "1px solid #1f2937", background: "#020617" }}>
      <div
        className="main-container"
        style={{ padding: "1rem 0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
            color: "#e5e7eb"
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "999px",
              background: "linear-gradient(135deg,#4f46e5,#22c55e)"
            }}
          />
          <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>CREATIVE AGENCY</span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: !isAdmin ? "#e5e7eb" : "#9ca3af"
            }}
          >
            Home
          </Link>
          <Link
            to="/admin"
            style={{
              textDecoration: "none",
              color: isAdmin ? "#e5e7eb" : "#9ca3af"
            }}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1f2937", marginTop: "2rem", padding: "1.25rem 0", background: "#020617" }}>
      <div className="main-container" style={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}>
        © {new Date().getFullYear()} Creative Agency. All rights reserved.
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
