import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, Twitter } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/bijaysoti', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/bijaysoti', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/bijaysoti', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@bijaysoti.com', label: 'Email' },
];

const SocialSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + index * 0.1 }}
          aria-label={social.label}
        >
          <social.icon size={20} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialSidebar;
