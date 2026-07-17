import serviceImage from '../assets/images/services/service-1.jpeg';
import serviceImageTwo from '../assets/images/services/service-2.jpeg';

const services = [
  { title: 'Braiding', description: 'Custom braided styles with premium finishing, scalp comfort, and a polished final look that lasts.', image: serviceImage },
  { title: 'Hair Fixing', description: 'Precision styling and finishing for a polished, confident appearance.', image: serviceImageTwo },
  { title: 'Wig Making', description: 'Handcrafted wig construction with a natural hairline, lightweight feel, and tailored styling support.' },
  { title: 'Hair Treatment', description: 'Deep nourishment and restoration for healthy-looking, well-kept hair.' },
  { title: 'Manicure', description: 'Elegant nail care and finishing for a complete beauty experience.' },
  { title: 'Pedicure', description: 'Relaxing foot care with a polished, fresh finish.' },
  { title: 'Make-over', description: 'Full beauty refresh with styling details that feel elevated and effortless.' },
  { title: 'Gele', description: 'Beautiful head-tie styling with a refined, timeless finish.' },
];

function Services() {
  const featuredServices = services.slice(0, 2);
  const otherServices = services.slice(2);

  return (
    <main className="page-shell">
      <section className="section services-page-section">
        <div className="section-heading">
          <p className="eyebrow">Our services</p>
          <h3 className="services-heading">Luxury hair services tailored to your lifestyle.</h3>
        </div>

        <div className="services-feature-grid" aria-label="Featured services">
          {featuredServices.map((service) => (
            <article className="service-card service-card--featured" key={service.title}>
              {service.image && <img className="service-card-image" src={service.image} alt={service.title} loading="lazy" />}
              <div className="service-card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="services-list-grid" aria-label="Other services">
          {otherServices.map((service) => (
            <article className="service-card service-card--list" key={service.title}>
              <div className="service-card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;
