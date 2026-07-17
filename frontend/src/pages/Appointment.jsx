import { useState } from 'react';

function Appointment() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Book appointment</p>
          <h2>Reserve a styling consultation or installation.</h2>
        </div>
        <form className="form-card" onSubmit={handleSubmit}>
          <input className="text-input" placeholder="Your name" required />
          <input className="text-input" placeholder="Email address" required />
          <input className="text-input" placeholder="Service" required />
          <input className="text-input" type="date" required />
          <textarea className="text-input" rows="4" placeholder="Notes" />
          <button className="button button-primary" type="submit">Submit request</button>
          {submitted && <p className="success-text">Thank you! Your request has been received.</p>}
        </form>
      </section>
    </main>
  );
}

export default Appointment;
