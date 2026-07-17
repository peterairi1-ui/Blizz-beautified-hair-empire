import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboard } from '../services/api';

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('bbhe-admin-token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await getAdminDashboard(token);
        setAdmin(response.admin || response); 
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load admin dashboard.');
        window.localStorage.removeItem('bbhe-admin-token');
        window.localStorage.removeItem('bbhe-admin-user');
        setTimeout(() => navigate('/admin/login'), 900);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    window.localStorage.removeItem('bbhe-admin-token');
    window.localStorage.removeItem('bbhe-admin-user');
    navigate('/admin/login');
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Admin dashboard</p>
          <h2>Protected administrator access for managing the storefront.</h2>
        </div>

        {loading ? (
          <p className="text-soft">Loading dashboard…</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="account-grid account-grid-stack">
            <div className="form-card">
              <p className="eyebrow">Hello, {admin?.name || 'Administrator'}</p>
              <h3>Welcome back to the admin panel.</h3>
              <p className="hero-text">Use the admin dashboard to review orders, inventory, and appointments securely.</p>
              <button className="button button-secondary" type="button" onClick={handleLogout}>Sign out</button>
            </div>

            <div className="form-card">
              <h3>Account details</h3>
              <div className="account-info-row">
                <strong>Email</strong>
                <span>{admin?.email}</span>
              </div>
              <div className="account-info-row">
                <strong>Role</strong>
                <span>{admin?.role}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
