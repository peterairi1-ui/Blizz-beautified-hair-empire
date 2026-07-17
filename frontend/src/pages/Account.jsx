import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, MapPin, Package, ShieldCheck, Sparkles } from 'lucide-react';

const defaultAddress = {
  line1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Nigeria',
};

import { Navigate } from 'react-router-dom';

function Account({
  customer,
  onLogout,
  onUpdateProfile,
  orders,
  addresses,
  wishlist,
  onAddAddress,
  onRemoveWishlist,
}) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [profileForm, setProfileForm] = useState({ name: customer?.name || '', phone: customer?.phone || '', address: customer?.address || '' });
  const [addressForm, setAddressForm] = useState(defaultAddress);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProfileForm({ name: customer?.name || '', phone: customer?.phone || '', address: customer?.address || '' });
  }, [customer]);

  const isLoggedIn = Boolean(customer);

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      await onUpdateProfile(profileForm);
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error.message || 'Unable to update profile');
    }
  };

  const handleAddressSave = async (event) => {
    event.preventDefault();
    try {
      await onAddAddress(addressForm);
      setAddressForm(defaultAddress);
      setMessage('Delivery address saved.');
    } catch (error) {
      setMessage(error.message || 'Unable to save address');
    }
  };

  const summary = useMemo(() => ({
    orders: orders.length,
    savedAddresses: addresses.length,
    wishlistItems: wishlist.length,
  }), [orders.length, addresses.length, wishlist.length]);

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Customer account</p>
          <h2>Manage your orders, addresses, and styling wishlist in one place.</h2>
        </div>

        {!isLoggedIn ? (
          <div className="account-grid">
            <div className="info-card account-card">
              <div className="eyebrow"><Sparkles size={16} /> My account</div>
              <h3>Sign in to track delivery, update preferences, and revisit your favorite looks.</h3>
              <div className="account-highlights">
                <div><ShieldCheck size={16} /> Secure access</div>
                <div><Package size={16} /> Order history</div>
                <div><MapPin size={16} /> Saved addresses</div>
              </div>
            </div>

            <form className="form-card" onSubmit={handleAuthSubmit}>
              <div className="auth-toggle">
                <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
                <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
              </div>

              {mode === 'register' && (
                <input className="text-input" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Full name" required />
              )}
              <input className="text-input" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email address" required />
              <input className="text-input" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Password" required />
              {mode === 'register' && (
                <>
                  <input className="text-input" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone number" />
                  <input className="text-input" value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Address" />
                </>
              )}
              <button className="button button-primary full-width" type="submit">{mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
              {message && <p className="success-text">{message}</p>}
            </form>
          </div>
        ) : (
          <div className="account-grid account-grid-stack">
            <div className="form-card">
              <div className="section-heading" style={{ marginBottom: '10px' }}>
                <p className="eyebrow">Welcome back</p>
                <h3>{customer.name}</h3>
              </div>
              <p className="text-soft">{customer.email}</p>
              <div className="account-stats">
                <div><strong>{summary.orders}</strong><span>Orders</span></div>
                <div><strong>{summary.savedAddresses}</strong><span>Addresses</span></div>
                <div><strong>{summary.wishlistItems}</strong><span>Wishlist</span></div>
              </div>
              <button className="button button-secondary" type="button" onClick={onLogout}>Sign out</button>
            </div>

            <div className="form-card">
              <h3>Profile details</h3>
              <form onSubmit={handleProfileSave} className="stacked-form">
                <input className="text-input" value={profileForm.name} onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Full name" />
                <input className="text-input" value={profileForm.phone} onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone number" />
                <input className="text-input" value={profileForm.address} onChange={(event) => setProfileForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Primary address" />
                <button className="button button-primary" type="submit">Save profile</button>
              </form>
              {message && <p className="success-text">{message}</p>}
            </div>

            <div className="form-card">
              <h3>Delivery addresses</h3>
              <form onSubmit={handleAddressSave} className="stacked-form">
                <input className="text-input" value={addressForm.line1} onChange={(event) => setAddressForm((prev) => ({ ...prev, line1: event.target.value }))} placeholder="Street address" />
                <input className="text-input" value={addressForm.city} onChange={(event) => setAddressForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" />
                <input className="text-input" value={addressForm.state} onChange={(event) => setAddressForm((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" />
                <input className="text-input" value={addressForm.postalCode} onChange={(event) => setAddressForm((prev) => ({ ...prev, postalCode: event.target.value }))} placeholder="Postal code" />
                <input className="text-input" value={addressForm.country} onChange={(event) => setAddressForm((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country" />
                <button className="button button-secondary" type="submit">Save address</button>
              </form>
              <div className="address-list">
                {addresses.map((address) => (
                  <div className="address-pill" key={`${address.line1}-${address.city}`}>
                    <strong>{address.line1}</strong>
                    <span>{address.city}, {address.state}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-card">
              <h3>Order tracking</h3>
              {orders.length === 0 ? <p className="empty-state">No orders yet. Checkout from your cart to create one.</p> : orders.map((order) => (
                <div className="cart-item" key={order.id}>
                  <div>
                    <strong>#{order.id}</strong>
                    <p>{order.items.map((item) => item.name).join(', ')}</p>
                  </div>
                  <div className="order-status">
                    <span>{order.status}</span>
                    <small>{order.date}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-card">
              <h3>Wishlist</h3>
              {wishlist.length === 0 ? <p className="empty-state">Your wishlist is empty. Save pieces from the shop to come back later.</p> : wishlist.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <button className="link-button" type="button" onClick={() => onRemoveWishlist(item.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Account;
