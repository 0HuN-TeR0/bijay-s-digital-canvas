import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const artworks = [
  {
    title: 'Digital Landscape',
    category: 'Digital Art',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop',
  },
  {
    title: 'Abstract Motion',
    category: 'Generative Art',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
  },
  {
    title: 'Code Poetry',
    category: 'Typography',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=600&fit=crop',
  },
  {
    title: 'Neon Dreams',
    category: 'Digital Art',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&fit=crop',
  },
  {
    title: 'Geometric Patterns',
    category: 'Generative Art',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=600&fit=crop',
  },
  {
    title: 'Tech Fusion',
    category: 'Digital Art',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop',
  },
];

const ArtsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="arts" className="py-24">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">~</span> Creative Arts <span className="section-title-bracket">~</span>
        </motion.h2>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {artworks.map((art, index) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-4"
              >
                <div>
                  <p className="text-xs text-primary font-mono uppercase">{art.category}</p>
                  <h3 className="text-lg font-bold">{art.title}</h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtsSection;
