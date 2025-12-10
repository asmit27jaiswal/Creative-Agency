import React, { useEffect, useState } from "react";
import { api } from "./api";

const BACKEND_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: ""
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [subMsg, setSubMsg] = useState("");

  useEffect(() => {
    api
      .get("/api/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoadingProjects(false));

    api
      .get("/api/clients")
      .then((res) => setClients(res.data))
      .finally(() => setLoadingClients(false));
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactMsg("");
    try {
      await api.post("/api/contact", contactForm);
      setContactMsg("Thank you. Your details have been submitted.");
      setContactForm({ fullName: "", email: "", phone: "", city: "" });
    } catch {
      setContactMsg("Failed to submit form. Please try again.");
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubMsg("");
    try {
      await api.post("/api/subscribe", { email: newsletterEmail });
      setSubMsg("Subscribed successfully.");
      setNewsletterEmail("");
    } catch {
      setSubMsg("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: "3.5rem 0",
          background: "radial-gradient(circle at top,#0f172a,#020617)"
        }}
      >
        <div className="main-container" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
          <div style={{ flex: "1 1 260px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "0.2rem 0.7rem",
                borderRadius: "999px",
                border: "1px solid #374151",
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginBottom: "0.75rem"
              }}
            >
              Full-stack MERN agency demo
            </div>
            <h1 style={{ fontSize: "2.4rem", margin: 0, lineHeight: 1.2 }}>
              Beautiful digital experiences for modern brands.
            </h1>
            <p style={{ marginTop: "0.9rem", color: "#9ca3af", fontSize: "0.95rem", maxWidth: 480 }}>
              Manage projects, happy clients, contact requests, and newsletter subscribers with a clean admin panel and
              live data from MongoDB Atlas.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <a
                href="#projects"
                style={{
                  padding: "0.7rem 1.6rem",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg,#4f46e5,#22c55e)",
                  border: "none",
                  color: "#e5e7eb",
                  fontWeight: 500,
                  textDecoration: "none",
                  fontSize: "0.9rem"
                }}
              >
                View Projects
              </a>
              <a
                href="#contact"
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: "999px",
                  border: "1px solid #374151",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  textDecoration: "none"
                }}
              >
                Contact Us
              </a>
            </div>
          </div>

          <div
            className="card-surface"
            style={{
              flex: "1 1 260px",
              minWidth: 260,
              padding: "1.3rem"
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.6rem" }}>Live overview</p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Projects</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                  {loadingProjects ? "…" : projects.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Happy Clients</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                  {loadingClients ? "…" : clients.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Stack</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 500 }}>MERN</div>
              </div>
            </div>
            <div style={{ marginTop: "1.3rem", fontSize: "0.85rem", color: "#9ca3af" }}>
              All stats are fetched via REST APIs from your Node.js + Express backend with MongoDB Atlas.
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="main-container">
        {/* Projects */}
        <section style={{ padding: "2.2rem 0" }} id="projects">
          <h2 className="section-title">Our Projects</h2>
          <p className="section-subtitle">Portfolio cards coming directly from the backend with uploaded images.</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1.5rem"
            }}
          >
            {loadingProjects &&
              [1, 2, 3].map((i) => (
                <div key={i} style={{ width: 300 }}>
                  <div className="skeleton" style={{ height: 200, marginBottom: "0.6rem" }} />
                  <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: "0.4rem" }} />
                  <div className="skeleton" style={{ height: 14, width: "90%" }} />
                </div>
              ))}

            {!loadingProjects &&
              projects.map((p) => (
                <div key={p._id} className="card-surface" style={{ width: 300 }}>
                  {p.imageUrl && (
                    <img
                      src={BACKEND_BASE + p.imageUrl}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "1rem",
                        borderTopRightRadius: "1rem"
                      }}
                    />
                  )}
                  <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                    <h3 style={{ fontSize: "1.05rem", marginBottom: "0.3rem" }}>{p.name}</h3>
                    <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>{p.description}</p>
                    <button
                      style={{
                        marginTop: "0.6rem",
                        padding: "0.45rem 1rem",
                        borderRadius: "999px",
                        border: "1px solid #4f46e5",
                        background: "transparent",
                        color: "#e5e7eb",
                        fontSize: "0.82rem"
                      }}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}

            {!loadingProjects && projects.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
                No projects yet. Add some from the admin panel.
              </p>
            )}
          </div>
        </section>

        {/* Happy Clients */}
        <section style={{ padding: "2.2rem 0" }} id="clients">
          <h2 className="section-title">Happy Clients</h2>
          <p className="section-subtitle">Testimonials managed from the admin panel and stored in MongoDB.</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1.5rem"
            }}
          >
            {loadingClients &&
              [1, 2].map((i) => (
                <div key={i} style={{ width: 280 }}>
                  <div className="skeleton" style={{ height: 60, width: "70%", marginBottom: "0.6rem" }} />
                  <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: "0.4rem" }} />
                  <div className="skeleton" style={{ height: 14, width: "80%" }} />
                </div>
              ))}

            {!loadingClients &&
              clients.map((c) => (
                <div key={c._id} className="card-surface" style={{ width: 280, padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {c.imageUrl && (
                      <img
                        src={BACKEND_BASE + c.imageUrl}
                        alt={c.name}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>{c.designation}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#9ca3af", marginTop: "0.7rem" }}>{c.description}</p>
                </div>
              ))}

            {!loadingClients && clients.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
                No clients yet. Add some from the admin panel.
              </p>
            )}
          </div>
        </section>

        {/* Contact + Newsletter */}
        <section
          id="contact"
          style={{
            padding: "2.5rem 0 3rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem"
          }}
        >
          {/* Contact */}
          <div style={{ flex: "1 1 280px", minWidth: 280 }}>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">These details are stored in MongoDB and visible in the admin panel.</p>
            <form
              onSubmit={handleContactSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                maxWidth: "360px",
                marginTop: "1rem"
              }}
            >
              <input
                placeholder="Full Name"
                value={contactForm.fullName}
                onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
              <input
                placeholder="Mobile Number"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
              />
              <input
                placeholder="City"
                value={contactForm.city}
                onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#4f46e5",
                  color: "#e5e7eb",
                  fontWeight: "500",
                  alignSelf: "flex-start"
                }}
              >
                Submit
              </button>
              {contactMsg && <small style={{ color: "#9ca3af" }}>{contactMsg}</small>}
            </form>
          </div>

          {/* Newsletter */}
          <div style={{ flex: "1 1 280px", minWidth: 280 }}>
            <h2 className="section-title">Newsletter</h2>
            <p className="section-subtitle">
              Subscribed emails go to the database and are listed in the admin panel.
            </p>
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex",
                gap: "0.5rem",
                maxWidth: "360px",
                marginTop: "1rem",
                flexWrap: "wrap"
              }}
            >
              <input
                type="email"
                placeholder="Email Address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ flex: "1 1 180px" }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1.1rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#22c55e",
                  color: "#022c22",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap"
                }}
              >
                Subscribe
              </button>
            </form>
            {subMsg && <small style={{ color: "#9ca3af" }}>{subMsg}</small>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
