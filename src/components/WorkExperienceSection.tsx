import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

const experiences = [
  {
    title: 'Business Analyst',
    company: 'Yagya.AI',
    location: 'Kathmandu / Dhulikhel, Nepal',
    period: 'Oct 2024 - May 2025',
    type: 'Full-time',
    responsibilities: [
      'Conducted strategic research for AI solution expansion across enterprise sectors',
      'Drafted proposals, engaged clients, and facilitated development cycles',
      'Worked on scalable AI agent strategies for enterprise applications',
    ],
  },
  {
    title: 'Artificial Intelligence Engineer',
    company: 'ICEBRKR (Virtly Company)',
    location: 'Switzerland (Remote from Nepal)',
    period: 'Mar 2024 - Aug 2024',
    type: 'Internship',
    responsibilities: [
      'Developed real-time AI tools for virtual communications',
      'Built recommendation models and user behavior classifiers',
      'Integrated ML pipelines for adaptive user experiences',
    ],
  },
  {
    title: 'Artificial Intelligence Engineer',
    company: 'Omdena',
    location: 'Remote',
    period: 'Jul 2023 - Sep 2023',
    type: 'Open Source',
    responsibilities: [
      'Built NLP tools to analyze gender and social representations in text',
      'Created pipelines for sentiment classification and labeling',
      'Collaborated with global team on social impact AI projects',
    ],
  },
];

const WorkExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-24 bg-card/30">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">&lt;</span> Work Experience <span className="section-title-bracket">/&gt;</span>
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"
              />

              {/* Content Card */}
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-xl p-6 border border-border shadow-lg hover:border-primary/50 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-mono text-foreground">{exp.title}</h3>
                      <p className="text-primary font-semibold">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/30 whitespace-nowrap">
                      {exp.type}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, respIndex) => (
                      <motion.li
                        key={respIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + respIndex * 0.1 + 0.4 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceSection;
