import { Mail, Phone, MapPin } from 'lucide-react';

function Contact() {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Contact</p>
          <h3>We'd love to hear from you.</h3>
        </div>
        <div className="contact-grid">
          <div className="info-card">
            <h3><Phone size={16} /> Phone</h3>
            <p>+2348082153972</p>
          </div>
          <div className="info-card">
            <h3><Mail size={16} /> Email</h3>
            <p>Blizzbeautified@gmail.com</p>
          </div>
          <div className="info-card">
            <h3><MapPin size={16} /> Visit us</h3>
            <p>Suite 12, Lekki Phase 1, Lagos, Nigeria</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
