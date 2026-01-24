import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import WorkExperienceSection from '@/components/WorkExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import CVSection from '@/components/CVSection';
import AwardsSection from '@/components/AwardsSection';
import ArtsSection from '@/components/ArtsSection';
import CommunitySection from '@/components/CommunitySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SocialSidebar from '@/components/SocialSidebar';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Bijay Soti | AI/ML Engineer & Entrepreneur</title>
        <meta name="description" content="AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science. Building impactful AI solutions that solve real-world problems. Based in Kathmandu, Nepal." />
        <meta name="keywords" content="Bijay Soti, AI Engineer, ML Engineer, Machine Learning, Deep Learning, NLP, Data Science, Python, TensorFlow, PyTorch, Entrepreneur, Nepal" />
        <meta name="author" content="Bijay Soti" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bijaysoti.lovable.app/" />
        <meta property="og:title" content="Bijay Soti | AI/ML Engineer & Entrepreneur" />
        <meta property="og:description" content="AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science. Building impactful AI solutions." />
        <meta property="og:image" content="https://bijaysoti.lovable.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://bijaysoti.lovable.app/" />
        <meta name="twitter:title" content="Bijay Soti | AI/ML Engineer & Entrepreneur" />
        <meta name="twitter:description" content="AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science." />
        <meta name="twitter:image" content="https://bijaysoti.lovable.app/og-image.png" />
        <meta name="twitter:creator" content="@0__bijay__0" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Bijay Soti",
            "jobTitle": "AI/ML Engineer & Entrepreneur",
            "url": "https://bijaysoti.lovable.app",
            "email": "bijay.soti.professional@gmail.com",
            "image": "https://bijaysoti.lovable.app/og-image.png",
            "sameAs": [
              "https://www.linkedin.com/in/beezay810/",
              "https://github.com/0HuN-TeR0",
              "https://x.com/0__bijay__0"
            ],
            "knowsAbout": ["Machine Learning", "Deep Learning", "NLP", "Data Science", "Python", "TensorFlow", "PyTorch"],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kathmandu",
              "addressCountry": "Nepal"
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "CG Institute of Management"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <SocialSidebar />
        
        <main>
          <HeroSection />
          <AboutSection />
          <WorkExperienceSection />
          <ProjectsSection />
          <CVSection />
          <AwardsSection />
          <ArtsSection />
          <CommunitySection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
