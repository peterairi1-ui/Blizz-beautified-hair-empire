const gallery01 = '/uploads/braided-wigs/braided-wig-02.jpeg';
const gallery02 = '/uploads/braided-wigs/braided-wig-03.jpeg';
const gallery03 = '/uploads/braided-wigs/braided-wig-04.jpeg';

const galleryItems = [gallery01, gallery02, gallery03].filter(Boolean);

function Gallery() {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Gallery</p>
          <h3>A glimpse into our premium styling work.</h3>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((image, index) => (
            <div key={index} className="gallery-item"><img src={image} alt={`Gallery ${index + 1}`} loading="lazy" /></div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Gallery;
