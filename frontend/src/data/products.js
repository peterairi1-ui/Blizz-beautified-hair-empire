import serviceImage from '../assets/images/services/service-1.jpeg';
import serviceImageTwo from '../assets/images/services/service-2.jpeg';

import wig01 from '../assets/images/products/braided-wigs/braided-wig-01.jpeg';
import wig02 from '../assets/images/products/braided-wigs/braided-wig-02.jpeg';
import wig03 from '../assets/images/products/braided-wigs/braided-wig-03.jpeg';
import wig04 from '../assets/images/products/braided-wigs/braided-wig-04.jpeg';
import wig05 from '../assets/images/products/braided-wigs/braided-wig-05.jpeg';
import wig06 from '../assets/images/products/braided-wigs/braided-wig-06.jpeg';
import wig07 from '../assets/images/products/braided-wigs/braided-wig-07.jpeg';
import wig08 from '../assets/images/products/braided-wigs/braided-wig-08.jpeg';
import wig09 from '../assets/images/products/braided-wigs/braided-wig-09.jpeg';
import wig10 from '../assets/images/products/braided-wigs/braided-wig-10.jpeg';
import wig11 from '../assets/images/products/braided-wigs/braided-wig-11.jpeg';
import wig12 from '../assets/images/products/braided-wigs/braided-wig-12.jpeg';
import wig13 from '../assets/images/products/braided-wigs/braided-wig-13.jpeg';
import wig14 from '../assets/images/products/braided-wigs/braided-wig-14.jpeg';
import wig15 from '../assets/images/products/braided-wigs/braided-wig-15.jpeg';
import wig16 from '../assets/images/products/braided-wigs/braided-wig-16.jpeg';
import wig17 from '../assets/images/products/braided-wigs/braided-wig-17.jpeg';

const products = [
  { id: 1, name: 'Braided Wig 01', image: wig01, price: 1200, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: true, newArrival: true, description: 'Elegant braided wig crafted for a polished finish and comfortable wear.' },
  { id: 2, name: 'Braided Wig 02', image: wig02, price: 1350, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: false, newArrival: true, description: 'Soft texture and natural movement for everyday luxury.' },
  { id: 3, name: 'Braided Wig 03', image: wig03, price: 1450, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: true, newArrival: false, description: 'A refined braided style created with volume and balance in mind.' },
  { id: 4, name: 'Braided Wig 04', image: wig04, price: 1280, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: false, newArrival: false, description: 'Lightweight and graceful for a soft, feminine statement.' },
  { id: 5, name: 'Braided Wig 05', image: wig05, price: 1500, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: true, newArrival: true, description: 'Full-bodied design with a luxurious finish and natural appearance.' },
  { id: 6, name: 'Braided Wig 06', image: wig06, price: 1380, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: false, newArrival: true, description: 'A chic braided texture designed to elevate any look.' },
  { id: 7, name: 'Braided Wig 07', image: wig07, price: 1420, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: true, newArrival: false, description: 'Sculpted braids that feel premium, comfortable and versatile.' },
  { id: 8, name: 'Braided Wig 08', image: wig08, price: 1320, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: false, newArrival: true, description: 'Luxury texture and a flattering silhouette for daily glamour.' },
  { id: 9, name: 'Braided Wig 09', image: wig09, price: 1490, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: true, newArrival: false, description: 'Beautifully finished braids with a graceful, premium feel.' },
  { id: 10, name: 'Braided Wig 10', image: wig10, price: 1360, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: false, newArrival: true, description: 'A statement piece that brings elegance and movement together.' },
  { id: 11, name: 'Braided Wig 11', image: wig11, price: 1410, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: true, newArrival: false, description: 'Balanced styling and premium craftsmanship from every angle.' },
  { id: 12, name: 'Braided Wig 12', image: wig12, price: 1340, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: false, newArrival: true, description: 'A versatile braided look designed for sophisticated styling.' },
  { id: 13, name: 'Braided Wig 13', image: wig13, price: 1520, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: true, newArrival: false, description: 'Premium finish with a rich texture and elegant presence.' },
  { id: 14, name: 'Braided Wig 14', image: wig14, price: 1390, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: false, newArrival: true, description: 'The perfect blend of softness, volume and modern structure.' },
  { id: 15, name: 'Braided Wig 15', image: wig15, price: 1460, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: true, newArrival: false, description: 'Crafted for a full, luxe finish that feels effortlessly chic.' },
  { id: 16, name: 'Braided Wig 16', image: wig16, price: 1370, currency: 'NGN', category: 'Braided Wigs', featured: true, bestSeller: false, newArrival: true, description: 'Elegant and timeless, with a soft structure that flatters every face.' },
  { id: 17, name: 'Braided Wig 17', image: wig17, price: 1480, currency: 'NGN', category: 'Braided Wigs', featured: false, bestSeller: true, newArrival: false, description: 'A luxurious braided look designed to feel bold and beautiful.' },
];

export const services = [
  { title: 'Braiding', description: 'Custom braided styles with premium finishing', image: serviceImage, price: 'From ₦35,000' },
  { title: 'Wig Making', description: 'Handcrafted wig construction for a natural finish', image: serviceImageTwo, price: 'From ₦45,000' },
];

export default products;
