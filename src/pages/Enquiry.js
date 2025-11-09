import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";

const CONFIG = {
  WHATSAPP_NO: "917986297302"
};

export default function Enquiry() {
  const [form, setForm] = useState({ name: "", city: "", mobile: "", email: "", message: "" });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    const { name, city, mobile, email, message } = form;
    if (!name.trim() || !city.trim() || !mobile.trim()) {
      alert("Please fill required fields");
      return;
    }
    let text = `New enquiry from ${name.trim()}%0ACity: ${city.trim()}%0AMobile: ${mobile.trim()}`;
    if (email.trim()) text += `%0AEmail: ${email.trim()}`;
    if (message.trim()) text += `%0A%0AMessage:%0A${message.trim()}`;

    const wa = `https://wa.me/${CONFIG.WHATSAPP_NO}?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank");
  }

  return (
    <PageWrapper>
      <h2>Enquiry</h2>
      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <input name="name" placeholder="Name *" required value={form.name} onChange={onChange} />
            <input name="city" placeholder="City *" required value={form.city} onChange={onChange} />
            <input name="mobile" placeholder="Mobile *" required value={form.mobile} onChange={onChange} />
            <input name="email" placeholder="Email (optional)" value={form.email} onChange={onChange} />
          </div>
          <textarea name="message" placeholder="Tell us your requirement..." value={form.message} onChange={onChange} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn" type="submit">Send via WhatsApp</button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
  
