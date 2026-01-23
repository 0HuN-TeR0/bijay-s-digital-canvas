import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
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
        <meta name="description" content="Bijay Soti - AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science. First Class Honours graduate building impactful AI solutions. Based in Nepal." />
        <meta name="keywords" content="Bijay Soti, AI Engineer, ML Engineer, Machine Learning, Deep Learning, NLP, Data Science, Entrepreneur, Nepal" />
        <meta name="author" content="Bijay Soti" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Bijay Soti | AI/ML Engineer & Entrepreneur" />
        <meta property="og:description" content="AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science. Building impactful AI solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bijaysoti.lovable.app" />
        <meta property="og:image" content="https://bijaysoti.lovable.app/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bijay Soti | AI/ML Engineer & Entrepreneur" />
        <meta name="twitter:description" content="AI/ML Engineer & Entrepreneur specializing in deep learning, NLP, and data science." />
        <meta name="twitter:image" content="https://bijaysoti.lovable.app/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Bijay Soti",
            "jobTitle": "AI/ML Engineer & Entrepreneur",
            "url": "https://bijaysoti.lovable.app",
            "email": "bijay.soti.professional@gmail.com",
            "sameAs": [
              "https://www.linkedin.com/in/beezay810/",
              "https://github.com/0HuN-TeR0",
              "https://x.com/0__bijay__0"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Damauli",
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
