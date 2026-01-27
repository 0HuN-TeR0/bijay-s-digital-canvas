import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';
import projectAI from '@/assets/project-ai-visualization.jpg';
import projectSaaS from '@/assets/project-saas-dashboard.jpg';
import projectBlockchain from '@/assets/project-blockchain.jpg';
import projectNLP from '@/assets/project-nlp.jpg';
import projectML from '@/assets/project-ml-prediction.jpg';
import projectAnalytics from '@/assets/project-analytics.jpg';
import projectOptmax from '@/assets/project-optmax.jpg';

const projects = [
  {
    title: 'OptMax',
    description: 'GPU Recommendation System using KNN algorithm. Helps users find the optimal graphics card based on price, performance, VRAM, and release year preferences.',
    tags: ['Python', 'KNN', 'Scikit-learn', 'Data Analysis'],
    image: projectOptmax,
    github: 'https://github.com/0HuN-TeR0/Optmax',
    live: '/demo/optmax',
  },
  {
    title: 'Collab-Pro',
    description: 'AI-powered influencer marketing platform for niche marketing. Matches brands with influencers using recommendation algorithms.',
    tags: ['Python', 'AI/ML', 'FastAPI', 'PostgreSQL'],
    image: projectSaaS,
    github: 'https://github.com/0HuN-TeR0',
    live: '/demo/collab-pro',
  },
  {
    title: 'NLP Gender Analysis',
    description: 'NLP tools to analyze gender and social representations in text. Sentiment classification and labeling pipelines.',
    tags: ['Python', 'NLP', 'Scikit-learn', 'NLTK'],
    image: projectNLP,
    github: 'https://github.com/0HuN-TeR0',
    live: '/demo/nlp-analysis',
  },
  {
    title: 'Crypto Dashboard',
    description: 'Cryptocurrency analytics dashboard with real-time data visualization and portfolio tracking capabilities.',
    tags: ['React', 'TypeScript', 'REST API', 'Charts'],
    image: projectBlockchain,
    github: 'https://github.com/0HuN-TeR0',
    live: '/demo/crypto',
  },
  {
    title: 'Financial Analytics',
    description: 'Technical and fundamental analysis tools for financial securities with interactive visualizations and predictive insights.',
    tags: ['Python', 'AI', 'NumPy', 'Data Analysis'],
    image: projectAnalytics,
    github: 'https://github.com/0HuN-TeR0',
    live: '/demo/financial-analytics',
  },
  {
    title: 'ML Prediction Models',
    description: 'End-to-end machine learning projects including supervised and unsupervised models from WorldQuant Applied Data Science Lab.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
    image: projectML,
    github: 'https://github.com/0HuN-TeR0',
    live: 'https://github.com/0HuN-TeR0',
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-24 bg-card/30">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">&#123;</span> Projects <span className="section-title-bracket">&#125;</span>
        </motion.h2>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden card-hover border border-border"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                
                {/* Tags overlay */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tech-badge text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github size={16} />
                    Code
                  </a>
                  {project.live.startsWith('/') ? (
                    <Link
                      to={project.live}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </Link>
                  ) : (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
