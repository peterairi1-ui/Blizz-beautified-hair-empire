import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminLogin, createProduct, deleteProduct, getAdminDashboard, getAllProducts, updateProduct, writeCachedProducts } from '../services/api';

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  tags: '',
  featured: false,
  bestSeller: false,
  newArrival: false,
  isActive: true,
};

function Admin({ visitorCount = 0 }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProductForm);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [token, setToken] = useState(() => window.localStorage.getItem('bbhe-admin-token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    const savedUser = window.localStorage.getItem('bbhe-admin-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const imagePreviews = useMemo(() => Array.from(newImages).map((file) => URL.createObjectURL(file)), [newImages]);

  useEffect(() => {
    if (!token) return;
    const loadDashboard = async () => {
      try {
        await getAdminDashboard(token);
        const data = await getAllProducts(token);
        const nextProducts = Array.isArray(data) ? data : [];
        setProducts(nextProducts);
        writeCachedProducts(nextProducts);
      } catch (error) {
        setMessage(error.message || 'Unable to load dashboard');
      }
    };

    loadDashboard();
  }, [token]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await adminLogin(email, password);
      const nextToken = response.token || '';
      const nextAdmin = response.admin || null;
      window.localStorage.setItem('bbhe-admin-token', nextToken);
      window.localStorage.setItem('bbhe-admin-user', JSON.stringify(nextAdmin));
      setToken(nextToken);
      setAdminUser(nextAdmin);
      setMessage('Signed in successfully');
      setPassword('');
    } catch (error) {
      setMessage(error.message || 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('bbhe-admin-token');
    window.localStorage.removeItem('bbhe-admin-user');
    setToken('');
    setAdminUser(null);
    setProducts([]);
    setSelectedProduct(null);
    setForm(emptyProductForm);
    setNewImages([]);
    setSelectedFileNames([]);
    setMessage('Signed out');
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setForm(emptyProductForm);
    setNewImages([]);
    setSelectedFileNames([]);
    setMessage('Editing mode cleared');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category?.name || product.category || '',
      tags: (product.tags || []).join(', '),
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
      isActive: product.isActive !== false,
    });
    setNewImages([]);
    setSelectedFileNames([]);
    setMessage('Edit mode enabled for selected product');
  };

  const buildProductPayload = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', String(form.price));
    formData.append('category', form.category);
    formData.append('tags', form.tags);
    formData.append('featured', String(form.featured));
    formData.append('bestSeller', String(form.bestSeller));
    formData.append('newArrival', String(form.newArrival));
    formData.append('isActive', String(form.isActive));

    if (newImages.length) {
      Array.from(newImages).forEach((file) => {
        formData.append('images', file);
      });
    }

    return formData;
  };

  const handleImageSelection = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setNewImages(nextFiles);
    setSelectedFileNames(nextFiles.map((file) => file.name));
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    if (!token) {
      setMessage('Please sign in first.');
      return;
    }

    setMessage('');
    try {
      const payload = buildProductPayload();
      if (selectedProduct) {
        const updated = await updateProduct(selectedProduct._id || selectedProduct.id, payload, token);
        const nextProducts = products.map((item) => ((item._id || item.id) === (updated._id || updated.id) ? updated : item));
        setProducts(nextProducts);
        writeCachedProducts(nextProducts);
        setMessage('✅ Product saved successfully');
        toast.success('✅ Product saved successfully', { duration: 3000 });
      } else {
        const created = await createProduct(payload, token);
        const nextProducts = [created, ...products];
        setProducts(nextProducts);
        writeCachedProducts(nextProducts);
        setMessage('✅ Product saved successfully');
        toast.success('✅ Product saved successfully', { duration: 3000 });
      }
      setSelectedProduct(null);
      setForm(emptyProductForm);
      setNewImages([]);
      setSelectedFileNames([]);
    } catch (error) {
      const errorMessage = error.message || 'Unable to save product';
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const updated = await updateProduct(product._id || product.id, { isActive: !product.isActive }, token);
      const nextProducts = products.map((item) => ((item._id || item.id) === (updated._id || updated.id) ? updated : item));
      setProducts(nextProducts);
      writeCachedProducts(nextProducts);
    } catch (error) {
      setMessage(error.message || 'Unable to update product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId, token);
      const nextProducts = products.filter((item) => (item._id || item.id) !== productId);
      setProducts(nextProducts);
      writeCachedProducts(nextProducts);
      setMessage('Product removed');
    } catch (error) {
      setMessage(error.message || 'Unable to delete product');
    }
  };

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Admin access</p>
          <h2 className="admin-login-heading">Secure dashboard for inventory, orders, and appointments.</h2>
        </div>

        {!token ? (
          <form className="form-card" onSubmit={handleLogin}>
            <input className="text-input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" />
            <input className="text-input" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
            <button className="button button-primary" type="submit" disabled={isLoading}>{isLoading ? 'Signing in…' : 'Enter dashboard'}</button>
            {message && <p className="success-text">{message}</p>}
          </form>
        ) : (
          <div className="checkout-grid">
            <div className="form-card">
              <div className="section-heading" style={{ marginBottom: '8px' }}>
                <p className="eyebrow">Signed in</p>
                <h3>{adminUser?.name || 'Administrator'}</h3>
              </div>
              <p className="success-text">Visitors this session: {visitorCount}</p>
              <button className="button button-secondary" type="button" onClick={handleLogout}>Sign out</button>
              <form onSubmit={handleSubmitProduct} className="form-card" style={{ padding: 0, boxShadow: 'none', border: 'none', background: 'transparent' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p className="eyebrow">{selectedProduct ? 'Edit product' : 'Add new product'}</p>
                  <h3>{selectedProduct ? 'Update product details' : 'Create a new product'}</h3>
                </div>
                <input className="text-input" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Product name" required />
                <textarea className="text-input" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Description" rows="3" required />
                <input className="text-input" type="number" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Price" required />
                <input className="text-input" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="Category" />
                <input className="text-input" value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="Tags (comma separated)" />
                <div className="image-upload-group">
                  <label htmlFor="product-images">Upload new images (optional to replace current images)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <label htmlFor="product-images" className="button button-secondary" style={{ margin: 0, cursor: 'pointer' }}>
                      Choose Files
                    </label>
                    <input
                      id="product-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelection}
                      style={{ display: 'none' }}
                    />
                    <span className="text-input" style={{ display: 'inline-block', minWidth: '220px', padding: '0.8rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }}>
                      {selectedFileNames.length ? selectedFileNames.join(', ') : 'No files selected'}
                    </span>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="image-preview-grid">
                      {imagePreviews.map((preview, index) => (
                        <img key={preview} src={preview} alt={`Preview ${index + 1}`} className="preview-thumbnail" />
                      ))}
                    </div>
                  )}
                </div>
                <label><input type="checkbox" checked={form.featured} onChange={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))} /> Featured</label>
                <label><input type="checkbox" checked={form.bestSeller} onChange={() => setForm((prev) => ({ ...prev, bestSeller: !prev.bestSeller }))} /> Best seller</label>
                <label><input type="checkbox" checked={form.newArrival} onChange={() => setForm((prev) => ({ ...prev, newArrival: !prev.newArrival }))} /> New arrival</label>
                <label><input type="checkbox" checked={form.isActive} onChange={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} /> Active</label>
                <div className="form-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="button button-primary" type="submit">
                    {selectedProduct ? 'Save Product' : 'Add Product'}
                  </button>
                  {selectedProduct && (
                    <button type="button" className="button button-secondary" onClick={resetForm}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="form-card">
              <div className="section-heading" style={{ marginBottom: '8px' }}>
                <p className="eyebrow">Inventory</p>
                <h3>Current products</h3>
              </div>
              {products.length === 0 ? <p className="empty-state">No products yet.</p> : products.map((product) => (
                <div className="cart-item-card" key={product._id || product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                    <p>₦{Number(product.price).toLocaleString()}</p>
                    {product.images?.length > 0 && (
                      <div className="admin-image-row">
                        {product.images.slice(0, 3).map((image) => {
                          const raw = String(image || '');
                          let src = '';
                          if (raw.startsWith('http')) src = raw;
                          else if (raw.startsWith('/')) src = raw;
                          else if (raw) src = `/${raw.replace(/^\/+/, '')}`;
                          return <img key={raw} src={src} alt={product.name} className="preview-thumbnail" />;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <button className="link-button" type="button" onClick={() => handleEditProduct(product)}>Edit</button>
                    <button className="link-button" type="button" onClick={() => handleToggleActive(product)}>{product.isActive ? 'Hide' : 'Show'}</button>
                    <button className="link-button" type="button" onClick={() => handleDelete(product._id || product.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {message && <p className="success-text">{message}</p>}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;
