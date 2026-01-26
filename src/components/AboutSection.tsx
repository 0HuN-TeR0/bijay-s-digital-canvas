import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import profilePhoto from '@/assets/profile-photo.jpg';

const skills = [
  'AI/ML Engineering',
  'Deep Learning',
  'NLP',
  'Data Science',
  'Business Analytics',
  'Entrepreneurship',
];

const techStack = {
  'AI/ML': ['PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'NumPy'],
  'Data': ['PostgreSQL', 'MongoDB', 'MySQL', 'Pandas', 'Matplotlib'],
  'LLMs': ['AI Agents', 'RAG', 'Vector DBs', 'LangChain'],
  'DevOps': ['Git', 'Docker', 'GitLab', 'AWS'],
};

const education = [
  {
    institution: 'CG Institute of Management',
    affiliation: 'Affiliated with Limkokwing University, Malaysia',
    period: '2021 - 2024',
    degree: 'B.IT with Technopreneurship (Hons)',
    grade: 'CGPA: 3.96/4.0 (First Class Honours)',
  },
  {
    institution: 'PratiVa Secondary School',
    period: '2018 - 2021',
    degree: 'Higher Secondary (Science)',
    grade: 'CGPA: 3.62',
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">&lt;</span> About Me <span className="section-title-bracket">/&gt;</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Photo & Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative">
                <div className="w-48 h-72 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <img
                    src={profilePhoto}
                    alt="Bijay Soti"
                    className="w-full h-full object-cover object-[center_15%] scale-[0.95]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-primary rounded-lg -z-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-mono mb-4">BIJAY SOTI</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Academic high-achiever with a First Class Honours degree in Information Technology 
                  (CGPA: 3.96/4.0). Proven track record in AI/ML engineering through international 
                  internships and open-source collaborations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I don't just build AI models—I build products. From developing recommendation systems 
                  at ICEBRKR (Switzerland) to leading AI strategy at Yagya.AI, I bridge the gap between 
                  cutting-edge technology and real business impact. Passionate about turning complex 
                  data into actionable insights and scalable solutions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Education */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold font-mono mb-6">EDUCATION</h3>
        <div className="relative pl-8">
              <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-border" />
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="relative pb-8 last:pb-0"
                >
                  <div className="absolute left-[-25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />
                  <h4 className="font-semibold text-foreground">{edu.institution}</h4>
                  {edu.affiliation && (
                    <p className="text-xs text-muted-foreground">{edu.affiliation}</p>
                  )}
                  <p className="text-sm text-primary font-mono">{edu.period}</p>
                  <p className="text-muted-foreground">{edu.degree}</p>
                  <p className="text-sm text-primary/80">{edu.grade}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills & Tech Stack */}
        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-bold font-mono mb-6">CORE EXPERTISE</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="skill-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold font-mono mb-6">TECH STACK</h3>
            <div className="space-y-4">
              {Object.entries(techStack).map(([category, techs], catIndex) => (
                <div key={category}>
                  <p className="text-sm text-primary font-mono mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="tech-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.7 + catIndex * 0.1 + index * 0.03 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
