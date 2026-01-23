import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import artCosmicMind from '@/assets/art-cosmic-mind.jpg';
import artZenPeace from '@/assets/art-zen-peace.jpg';
import artDigitalEvolution from '@/assets/art-digital-evolution.jpg';
import artTreeWisdom from '@/assets/art-tree-wisdom.jpg';
import artInfinitePath from '@/assets/art-infinite-path.jpg';
import artPhoenixCode from '@/assets/art-phoenix-code.jpg';

const artworks = [
  {
    title: 'The Cosmic Mind',
    category: 'Philosophy',
    image: artCosmicMind,
    quote: '"The mind is not a vessel to be filled, but a fire to be kindled." — Plutarch',
  },
  {
    title: 'Stillness Within',
    category: 'Mindfulness',
    image: artZenPeace,
    quote: '"In the midst of movement and chaos, keep stillness inside of you." — Deepak Chopra',
  },
  {
    title: 'Digital Evolution',
    category: 'Technology',
    image: artDigitalEvolution,
    quote: '"We are not just users of technology, we are becoming one with it." — Unknown',
  },
  {
    title: 'Roots of Wisdom',
    category: 'Growth',
    image: artTreeWisdom,
    quote: '"The only true wisdom is knowing you know nothing." — Socrates',
  },
  {
    title: 'The Infinite Path',
    category: 'Journey',
    image: artInfinitePath,
    quote: '"A journey of a thousand miles begins with a single step." — Lao Tzu',
  },
  {
    title: 'Phoenix Rising',
    category: 'Resilience',
    image: artPhoenixCode,
    quote: '"From the ashes of failure, the phoenix of success is born." — Unknown',
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
          className="section-title text-center mb-4"
        >
          <span className="section-title-bracket">~</span> Creative Arts <span className="section-title-bracket">~</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          A collection of philosophical reflections and visual meditations that inspire my work and worldview.
        </motion.p>

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
                className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col justify-end p-4"
              >
                <p className="text-xs text-primary font-mono uppercase mb-1">{art.category}</p>
                <h3 className="text-lg font-bold mb-2">{art.title}</h3>
                <p className="text-xs text-muted-foreground italic line-clamp-2">{art.quote}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtsSection;
