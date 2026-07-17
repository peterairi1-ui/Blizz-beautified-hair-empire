import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

function ForgotPassword({ onForgot }) {
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
      const result = await onForgot(email);
      setMessage(result.resetLink ? `Reset link: ${result.resetLink}` : 'If this email is registered, a password reset link has been sent.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Forgot password</p>
          <h2>Enter your registered email to receive reset instructions.</h2>
        </div>

        <div className="account-grid">
          <div className="info-card account-card">
            <div className="eyebrow"><Sparkles size={16} /> Password help</div>
            <h3>We’ll send a secure link so you can reset your password safely and quickly.</h3>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            <input
              className="text-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
            />
            <button className="button button-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
              <ArrowRight size={16} />
            </button>
            <p className="auth-footer"><Link to="/auth">Back to Login</Link></p>
            {message && <p className="success-text auth-status">{message}</p>}
            {error && <p className="error-text auth-status">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
