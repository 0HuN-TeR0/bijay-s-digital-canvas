import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Award, Star, Medal, Lightbulb, Cpu } from 'lucide-react';

const awards = [
  {
    icon: Trophy,
    title: 'First Position - College Honor',
    event: 'CG Institute of Management',
    date: '2024',
    description: 'Awarded for securing 1st position in my batch with outstanding academic performance (CGPA: 3.96/4.0).',
  },
  {
    icon: Award,
    title: 'Babal Challenge – Runner-Up',
    event: "King's College",
    date: '2023',
    description: 'Second place for Collab-Pro—an AI-powered influencer marketing platform for niche marketing.',
  },
  {
    icon: Lightbulb,
    title: 'Business Development Bootcamp',
    event: 'CGIM',
    date: '2023',
    description: '5-day intensive program focused on building a business from scratch with hands-on entrepreneurship training.',
  },
  {
    icon: Star,
    title: 'SecurityPal Secret Hackathon',
    event: 'SecurityPal',
    date: '2023',
    description: 'Team-based hackathon focused on collaboration, leadership, and brainstorming under pressure.',
  },
  {
    icon: Medal,
    title: 'Technical & Fundamental Analysis',
    event: 'Ideapreneur Nepal & Sikable',
    date: '2022',
    description: 'Achieved intermediate-level proficiency in technical and fundamental analysis of financial securities.',
  },
  {
    icon: Cpu,
    title: 'Hardware Fellowship',
    event: 'LOCUS, IOE Pulchowk',
    date: '2022',
    description: 'Hands-on experience with IoT, Arduino, sensors, motors, and electronic system design with collaborative innovation.',
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold font-mono text-sm">{award.title}</h3>
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
