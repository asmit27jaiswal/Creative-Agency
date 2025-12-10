import React, { useEffect, useState } from "react";
import { api } from "./api";

function AdminPanel() {
  const [projectForm, setProjectForm] = useState({ name: "", description: "", image: null });
  const [clientForm, setClientForm] = useState({ name: "", designation: "", description: "", image: null });
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const [savingProject, setSavingProject] = useState(false);
  const [savingClient, setSavingClient] = useState(false);

  const [stats, setStats] = useState({ projects: 0, clients: 0, contacts: 0, subs: 0 });

  const loadAdminData = async () => {
    const [projRes, clientRes, contactRes, subsRes] = await Promise.all([
      api.get("/api/projects"),
      api.get("/api/clients"),
      api.get("/api/admin/contacts"),
      api.get("/api/admin/subscribers")
    ]);

    setContacts(contactRes.data);
    setSubscribers(subsRes.data);
    setStats({
      projects: projRes.data.length,
      clients: clientRes.data.length,
      contacts: contactRes.data.length,
      subs: subsRes.data.length
    });
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const submitProject = async (e) => {
    e.preventDefault();
    setSavingProject(true);
    try {
      const fd = new FormData();
      fd.append("name", projectForm.name);
      fd.append("description", projectForm.description);
      if (projectForm.image) fd.append("image", projectForm.image);

      await api.post("/api/admin/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setProjectForm({ name: "", description: "", image: null });
      await loadAdminData();
      alert("Project saved");
    } catch (err) {
      alert("Failed to save project");
    } finally {
      setSavingProject(false);
    }
  };

  const submitClient = async (e) => {
    e.preventDefault();
    setSavingClient(true);
    try {
      const fd = new FormData();
      fd.append("name", clientForm.name);
      fd.append("designation", clientForm.designation);
      fd.append("description", clientForm.description);
      if (clientForm.image) fd.append("image", clientForm.image);

      await api.post("/api/admin/clients", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setClientForm({ name: "", designation: "", description: "", image: null });
      await loadAdminData();
      alert("Client saved");
    } catch (err) {
      alert("Failed to save client");
    } finally {
      setSavingClient(false);
    }
  };

  return (
    <div className="main-container admin-layout fade-in">
      {/* Header / summary */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="admin-pill">
          <span style={{ width: 8, height: 8, borderRadius: "999px", background: "#22c55e" }} />
          Admin Dashboard
        </div>
        <h1 style={{ fontSize: "1.8rem", margin: 0 }}>Admin Panel</h1>
        <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginTop: "0.3rem" }}>
          Manage projects, clients, contact form responses and newsletter subscribers.
        </p>
      </div>

      {/* Top stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "0.9rem",
          marginBottom: "1.6rem"
        }}
      >
        <div className="admin-card fade-in">
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Projects</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{stats.projects}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.3rem" }}>
            Total items visible on the landing page.
          </div>
        </div>
        <div className="admin-card fade-in">
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Clients</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{stats.clients}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.3rem" }}>
            Happy clients testimonials displayed on the site.
          </div>
        </div>
        <div className="admin-card fade-in">
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Contacts</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{stats.contacts}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.3rem" }}>
            Messages submitted via the contact form.
          </div>
        </div>
        <div className="admin-card fade-in">
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Subscribers</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>{stats.subs}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.3rem" }}>
            Newsletter signups stored in MongoDB.
          </div>
        </div>
      </div>

      {/* Forms grid */}
      <div className="admin-grid">
        {/* Project Management */}
        <section className="admin-card fade-in">
          <h2 className="admin-section-title">Project Management</h2>
          <p className="admin-section-subtitle">
            Add new projects to appear under the “Our Projects” section on the landing page.
          </p>
          <form
            onSubmit={submitProject}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.9rem" }}
          >
            <input
              placeholder="Project Name"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Project Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.files[0] })}
            />
            <button
              type="submit"
              disabled={savingProject}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "999px",
                border: "none",
                background: savingProject ? "#4b5563" : "#4f46e5",
                color: "#e5e7eb",
                fontWeight: "500",
                alignSelf: "flex-start",
                opacity: savingProject ? 0.8 : 1,
                transition: "background 0.2s ease, transform 0.1s ease"
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {savingProject ? "Saving..." : "Save Project"}
            </button>
          </form>
        </section>

        {/* Client Management */}
        <section className="admin-card fade-in">
          <h2 className="admin-section-title">Client Management</h2>
          <p className="admin-section-subtitle">
            Add happy clients to appear under the “Happy Clients” section on the landing page.
          </p>
          <form
            onSubmit={submitClient}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.9rem" }}
          >
            <input
              placeholder="Client Name"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Designation (e.g. CEO, Designer)"
              value={clientForm.designation}
              onChange={(e) => setClientForm({ ...clientForm, designation: e.target.value })}
              required
            />
            <textarea
              placeholder="Client Description / Testimonial"
              value={clientForm.description}
              onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
              required
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setClientForm({ ...clientForm, image: e.target.files[0] })}
            />
            <button
              type="submit"
              disabled={savingClient}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "999px",
                border: "none",
                background: savingClient ? "#047857" : "#22c55e",
                color: "#022c22",
                fontWeight: "500",
                alignSelf: "flex-start",
                opacity: savingClient ? 0.9 : 1,
                transition: "background 0.2s ease, transform 0.1s ease"
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {savingClient ? "Saving..." : "Save Client"}
            </button>
          </form>
        </section>
      </div>

      {/* Data tables */}
      <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
        {/* Contact Form Details */}
        <section className="admin-card fade-in">
          <h2 className="admin-section-title">Contact Form Details</h2>
          <p className="admin-section-subtitle">
            All messages submitted from the landing page contact form.
          </p>
          <div className="admin-table-wrapper" style={{ marginTop: "0.9rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id}>
                    <td>{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.city}</td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ fontSize: "0.85rem", color: "#6b7280", padding: "0.7rem" }}>
                      No contact submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Subscribers */}
        <section className="admin-card fade-in">
          <h2 className="admin-section-title">Subscribed Email Addresses</h2>
          <p className="admin-section-subtitle">
            All emails subscribed via the newsletter form on the landing page.
          </p>
          <div style={{ marginTop: "0.9rem" }}>
            {subscribers.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>No subscribers yet.</p>
            ) : (
              <ul className="admin-list">
                {subscribers.map((s) => (
                  <li key={s._id}>{s.email}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
