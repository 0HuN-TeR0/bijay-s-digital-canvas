import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Award, Star, Medal } from 'lucide-react';

const awards = [
  {
    icon: Trophy,
    title: 'Best Web Application',
    event: 'TechFest 2023',
    date: '2023',
    description: 'First place in the national web development competition for building an innovative healthcare platform.',
  },
  {
    icon: Award,
    title: 'Innovation Award',
    event: 'Startup Weekend',
    date: '2022',
    description: 'Recognized for developing an AI-powered solution for sustainable agriculture.',
  },
  {
    icon: Star,
    title: 'Top Contributor',
    event: 'Open Source Nepal',
    date: '2022',
    description: 'Acknowledged as one of the top open source contributors in the community.',
  },
  {
    icon: Medal,
    title: 'Academic Excellence',
    event: 'University Awards',
    date: '2021',
    description: 'Dean\'s list recognition for outstanding academic performance in Computer Science.',
  },
];

const AwardsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="awards" className="py-24 bg-card/30">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">★</span> Awards & Achievements <span className="section-title-bracket">★</span>
        </motion.h2>

        {/* Awards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {awards.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <award.icon size={24} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold font-mono">{award.title}</h3>
                    <span className="text-xs text-primary font-mono">{award.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{award.event}</p>
                  <p className="text-sm text-foreground/80">{award.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
