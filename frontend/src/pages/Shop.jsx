import { useEffect, useMemo, useState } from 'react';
import fallbackProducts from '../data/products';
import { getProducts, readCachedProducts, writeCachedProducts } from '../services/api';

function Shop({ currency, formatPrice, addToCart }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState(() => readCachedProducts().length ? readCachedProducts() : fallbackProducts);

  useEffect(() => {
    const syncProducts = () => {
      const cachedProducts = readCachedProducts();
      if (Array.isArray(cachedProducts) && cachedProducts.length) {
        setProducts(cachedProducts);
      }
    };

    syncProducts();
    window.addEventListener('bbhe-products-updated', syncProducts);

    getProducts().then((data) => {
      if (Array.isArray(data) && data.length) {
        setProducts(data);
        writeCachedProducts(data);
      }
    }).catch(() => {
      const cachedProducts = readCachedProducts();
      if (Array.isArray(cachedProducts) && cachedProducts.length) {
        setProducts(cachedProducts);
      } else {
        setProducts(fallbackProducts);
      }
    });

    return () => window.removeEventListener('bbhe-products-updated', syncProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    const next = [...products].filter((product) => {
      const haystack = `${product.name} ${product.description} ${product.category || ''} ${product.tags?.join(' ') || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesSearch;
    });

    switch (sortBy) {
      case 'price-low':
        return next.sort((a, b) => a.price - b.price);
      case 'price-high':
        return next.sort((a, b) => b.price - a.price);
      case 'newest':
        return next.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
      default:
        return next;
    }
  }, [products, search, sortBy]);

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Luxury shop</p>
          <h3>Browse your curated braided wig collection.</h3>
        </div>
        <div className="shop-toolbar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search wigs" className="text-input" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-input">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Lowest price</option>
            <option value="price-high">Highest price</option>
          </select>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product._id || product.id}>
              <div className="product-media">
                {(() => {
                  const raw = (product.images?.[0] || product.image || '') || '';
                  let src = '';
                  if (raw.startsWith('http')) src = raw;
                  else if (raw.startsWith('/')) src = raw;
                  else if (raw) src = `/${raw.replace(/^\/+/, '')}`;
                  return <img src={src || '/uploads/braided-wigs/braided-wig-01.jpeg'} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = '/uploads/braided-wigs/braided-wig-01.jpeg'; }} />;
                })()}
                <div className="product-meta-overlay">
                  <span className="product-price">{formatPrice(product.price, currency)}</span>
                  <button className="button button-primary product-cta" onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              </div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Shop;
