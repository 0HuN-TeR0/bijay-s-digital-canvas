import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Code, Heart, Globe } from 'lucide-react';

const communities = [
  {
    icon: Code,
    name: 'Open Source Nepal',
    role: 'Core Contributor',
    description: 'Contributing to open source projects and mentoring new developers in the community.',
    link: '#',
  },
  {
    icon: Users,
    name: 'TechMeetup Kathmandu',
    role: 'Organizer',
    description: 'Organizing monthly tech meetups, workshops, and hackathons for the local developer community.',
    link: '#',
  },
  {
    icon: Heart,
    name: 'Code for Change',
    role: 'Volunteer Developer',
    description: 'Building technology solutions for NGOs and social impact organizations.',
    link: '#',
  },
  {
    icon: Globe,
    name: 'Developer Student Clubs',
    role: 'Campus Lead',
    description: 'Leading initiatives to bridge the gap between classroom learning and industry practices.',
    link: '#',
  },
];

const CommunitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="community" className="py-24 bg-card/30">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title text-center mb-16"
        >
          <span className="section-title-bracket">&amp;</span> Community <span className="section-title-bracket">&amp;</span>
        </motion.h2>

        {/* Community Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {communities.map((community, index) => (
            <motion.a
              key={community.name}
              href={community.link}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border card-hover block group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <community.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold font-mono group-hover:text-primary transition-colors">
                    {community.name}
                  </h3>
                  <p className="text-sm text-primary font-mono mb-2">{community.role}</p>
                  <p className="text-sm text-muted-foreground">{community.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
