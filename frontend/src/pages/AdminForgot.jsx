import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { adminForgotPassword } from '../services/api';

function AdminForgot() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const result = await adminForgotPassword(email);
      setMessage(result.resetLink ? `Reset link: ${result.resetLink}` : 'If this email is registered, a reset link has been sent.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Admin password reset</p>
          <h2>Enter your administrator email to receive reset instructions.</h2>
        </div>

        <div className="account-grid">
          <div className="info-card account-card">
            <div className="eyebrow"><Sparkles size={16} /> Secure verify</div>
            <h3>We’ll send a secure reset link to the email associated with your admin account.</h3>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            <input
              className="text-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              required
            />
            <button className="button button-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
              <ArrowRight size={16} />
            </button>
            <p className="auth-footer"><Link to="/admin/login">Back to Admin Login</Link></p>
            {message && <p className="success-text auth-status">{message}</p>}
            {error && <p className="error-text auth-status">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

export default AdminForgot;
