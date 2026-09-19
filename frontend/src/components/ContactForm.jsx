import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error();
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          Name
          <input name="name" value={form.name} onChange={update} placeholder="Your name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required />
        </label>
      </div>

      <label>
        Message
        <textarea name="message" value={form.message} onChange={update} placeholder="Tell me about your project..." rows="6" required />
      </label>

      <button className="primary-btn" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"} <ArrowUpRight size={18} />
      </button>

      {status === "success" && (
        <p className="form-message success"><CheckCircle2 size={17} /> Message sent successfully.</p>
      )}
      {status === "error" && (
        <p className="form-message error">Something went wrong. Make sure the backend is running.</p>
      )}
    </form>
  );
}
