import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import heroImage from '../assets/images/hero/hero-1.jpeg';
import heroImageTwo from '../assets/images/hero/hero-2.jpeg';
import heroImageThree from '../assets/images/hero/hero-3.jpeg';
import salonHeroVideo from '../assets/video/salon-hero.mp4';
import serviceImage from '../assets/images/services/service-1.jpeg';
import serviceImageTwo from '../assets/images/services/service-2.jpeg';
import fallbackProducts from '../data/products';
import { getProducts, readCachedProducts, subscribeNewsletter, writeCachedProducts } from '../services/api';

const serviceHighlights = [
  {
    title: 'Luxury styling consultation',
    copy: 'Personalized recommendations for texture, colour, and wearability.',
    image: serviceImage,
  },
  {
    title: 'Premium order experience',
    copy: 'Secure checkout and carefully packaged delivery for every order.',
    image: serviceImageTwo,
  },
];

const heroSlides = [
  {
    eyebrow: 'Luxury braided wigs',
    title: 'Luxury Braided Wigs & Premium Hair Collections',
    description:
      'Discover handcrafted braided wigs, premium human hair, salon services, and beauty essentials designed for elegance and confidence.',
    image: heroImage,
  },
  {
    eyebrow: 'Signature styling',
    title: 'The soft-glamour look your wardrobe has been waiting for',
    description:
      'Explore refined textures, bespoke colour, and premium pieces curated to compliment every occasion and mood.',
    image: heroImageTwo,
  },
  {
    eyebrow: 'Salon-ready luxury',
    title: 'Modern beauty rituals with a polished, high-end finish',
    description:
      'From custom installations to premium beauty products, every detail is tailored to feel incredibly elevated.',
    image: heroImageThree,
  },
];

function Home({ currency, formatPrice, addToCart }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState(() => readCachedProducts().length ? readCachedProducts() : fallbackProducts);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroVideoError, setHeroVideoError] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const currentSlide = heroSlides[activeSlide];

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        await video.play();
        setHeroVideoReady(true);
      } catch {
        setHeroVideoError(true);
        setHeroVideoReady(false);
      }
    };

    tryPlay();
  }, []);

  useEffect(() => {
    const syncProducts = () => {
      const cachedProducts = readCachedProducts();
      if (Array.isArray(cachedProducts) && cachedProducts.length) {
        setProducts(cachedProducts);
      }
    };

    syncProducts();
    window.addEventListener('bbhe-products-updated', syncProducts);

    const productTimer = window.setTimeout(() => {
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
    }, 0);

    return () => {
      window.clearTimeout(productTimer);
      window.removeEventListener('bbhe-products-updated', syncProducts);
    };
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <main id="home">
      <section className="hero-section">
        <div className="hero-copy">
          <video
            ref={videoRef}
            className={`hero-bg-video ${heroVideoReady && !heroVideoError ? 'is-ready' : ''}`}
            src={salonHeroVideo}
            poster={currentSlide.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setHeroVideoReady(true)}
            onLoadedData={() => setHeroVideoReady(true)}
            onLoadedMetadata={() => setHeroVideoReady(true)}
            onError={() => {
              setHeroVideoError(true);
              setHeroVideoReady(false);
            }}
          />
          <div className="hero-bg-overlay" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
              className="hero-panel"
            >
              <p className="eyebrow"><Sparkles size={16} /> {currentSlide.eyebrow}</p>
              <h1 className="hero-slide-title">{currentSlide.title}</h1>
              <p className="hero-text">{currentSlide.description}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="/shop">Shop now <ArrowRight size={18} /></a>
                <a className="button button-secondary" href="/appointment">Book appointment</a>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="hero-controls">
            <button className="slider-arrow" onClick={prevSlide} aria-label="Previous slide"><ChevronLeft size={18} /></button>
            <div className="slider-dots" aria-label="Slide navigation">
              {heroSlides.map((slide, index) => (
                <button key={slide.title} className={`dot ${index === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} />
              ))}
            </div>
            <button className="slider-arrow" onClick={nextSlide} aria-label="Next slide"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="hero-media">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide.image}
              src={currentSlide.image}
              alt={currentSlide.title}
              loading="eager"
              decoding="async"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
          <div className="hero-overlay-card">
            <div><Phone size={16} /><span>Call for consultations</span></div>
            <div><MapPin size={16} /><span>Nationwide delivery</span></div>
            <div><Clock3 size={16} /><span>Open daily</span></div>
          </div>
        </div>
      </section>

      <section className="feature-strip" aria-label="Brand promises">
        <div><ShieldCheck size={18} /><span>Quality assurance</span></div>
        <div><Truck size={18} /><span>Tracked shipping</span></div>
        <div><MessageCircle size={18} /><span>Direct concierge care</span></div>
      </section>

      <section className="section" id="about">
        <div className="section-heading">
          <p className="eyebrow">Why clients choose us</p>
          <h3>A refined shopping experience that feels as good as it looks.</h3>
        </div>
        <div className="info-grid">
          <article className="info-card"><h3>Crafted for confidence</h3><p>Every piece is selected to blend beauty, comfort, and luxury into a seamless wardrobe upgrade.</p></article>
          <article className="info-card"><h3>Guided by expertise</h3><p>From first-time shoppers to repeat clients, our team helps you choose looks that feel effortless and elevated.</p></article>
          <article className="info-card"><h3>Made for modern styling</h3><p>We pair timeless glamour with practical care so your favorite pieces stay polished and ready to wear.</p></article>
        </div>
      </section>

      <section className="section" id="collections">
        <div className="section-heading">
          <p className="eyebrow">Featured braided wigs</p>
          <h3>Browse the latest luxury looks from your uploaded collection.</h3>
        </div>
        <div className="product-grid">
          {products.map((product) => {
            const raw = (product.images?.[0] || product.image || '') || '';
            let src = '';
            if (raw.startsWith('http')) src = raw;
            else if (raw.startsWith('/')) src = raw;
            else if (raw) src = `/${raw.replace(/^\/+/, '')}`;

            return (
              <article className="product-card" key={product._id || product.id}>
                <div className="product-media">
                  <img src={src} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = '/uploads/braided-wigs/braided-wig-01.jpeg'; }} />
                </div>
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">{formatPrice(product.price, currency)}</span>
                    <button className="button button-primary product-cta" type="button" onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading">
          <p className="eyebrow">Service experience</p>
          <h3>Luxury support that keeps your transformation seamless.</h3>
        </div>
        <div className="services-grid">
          {serviceHighlights.map((service) => (
            <article className="service-card" key={service.title}>
              <img src={service.image} alt={service.title} loading="lazy" />
              <div><h3>{service.title}</h3><p>{service.copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-cta">
        <div className="newsletter-copy">
          <p className="eyebrow">Private access</p>
          <h2>Receive first access to new arrivals, styling drops, and exclusive offers.</h2>
          <p>Join the list for appointment openings, premium launches, and inspiration delivered with intention.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required />
          <button className="button button-primary" type="submit">Subscribe</button>
          {subscribed && <span className="success-text">You’re on the list.</span>}
        </form>
      </section>

      <section className="section instagram-section" aria-label="Instagram inspiration">
        <div className="section-heading">
          <p className="eyebrow">Instagram inspiration</p>
          <h2 className="instagram-heading">Tag us in your selfies #BlizzBeautifiedEmpire</h2>
        </div>
        <div className="instagram-copy-card">
          <p className="instagram-tagline">Show us your favorite looks, styling moments, and everyday glam.</p>
          <a className="button button-primary" href="https://www.instagram.com/blizzbeautifiedEmpire" target="_blank" rel="noreferrer">Follow on Instagram</a>
        </div>
      </section>
    </main>
  );
}

export default Home;
