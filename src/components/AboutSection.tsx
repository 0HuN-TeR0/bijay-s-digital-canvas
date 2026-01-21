import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import profilePhoto from '@/assets/profile-photo.jpg';

const skills = ['Full Stack Dev', 'AI/ML', 'UI/UX Design', 'Cloud Architecture', 'DevOps', 'Project Management'];

const techStack = ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker', 'Git'];

const education = [
  {
    institution: 'Tribhuvan University',
    period: '2019 - 2023',
    degree: 'B.Sc. in Computer Science',
  },
  {
    institution: 'Higher Secondary School',
    period: '2017 - 2019',
    degree: 'Science Stream, Computer Science',
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
                <div className="w-48 h-48 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <img
                    src={profilePhoto}
                    alt="Bijay Soti"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-primary rounded-lg -z-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-mono mb-4">BIJAY SOTI</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A passionate full-stack developer with expertise in building scalable web applications 
                  and AI-powered solutions. I thrive on turning complex problems into elegant, 
                  user-friendly experiences. With a strong foundation in modern technologies and a 
                  keen eye for design, I create digital products that make a difference.
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
            <div className="relative pl-6">
              <div className="timeline-line" />
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="relative pb-8 last:pb-0"
                >
                  <div className="timeline-dot top-1" />
                  <h4 className="font-semibold text-foreground">{edu.institution}</h4>
                  <p className="text-sm text-primary font-mono">{edu.period}</p>
                  <p className="text-muted-foreground">{edu.degree}</p>
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
            <h3 className="text-xl font-bold font-mono mb-6">SKILLS</h3>
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
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="tech-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
