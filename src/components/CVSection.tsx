import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, FileText, Eye } from 'lucide-react';

const CVSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="cv" className="py-24">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">[</span> Curriculum Vitae <span className="section-title-bracket">]</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={36} className="text-primary" />
            </div>

            <h3 className="text-2xl font-bold font-mono mb-4">My Resume</h3>
            <p className="text-muted-foreground mb-8">
              Download my complete curriculum vitae to learn more about my experience, 
              education, skills, and achievements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/bijay-soti-cv.pdf"
                download
                className="btn-solid inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Download CV
              </motion.a>
              <motion.a
                href="/bijay-soti-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={18} />
                Preview
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CVSection;
