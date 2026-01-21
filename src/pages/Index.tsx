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
        <title>Bijay Soti | Full Stack Developer</title>
        <meta name="description" content="Bijay Soti - Full Stack Developer specializing in modern web applications, AI/ML solutions, and cloud architecture. Based in Kathmandu, Nepal." />
        <meta name="keywords" content="Bijay Soti, Full Stack Developer, Web Developer, React, Node.js, TypeScript, Nepal" />
        <meta name="author" content="Bijay Soti" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Bijay Soti | Full Stack Developer" />
        <meta property="og:description" content="Full Stack Developer specializing in modern web applications, AI/ML solutions, and cloud architecture." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bijaysoti.com" />
        <meta property="og:image" content="https://bijaysoti.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bijay Soti | Full Stack Developer" />
        <meta name="twitter:description" content="Full Stack Developer specializing in modern web applications, AI/ML solutions, and cloud architecture." />
        <meta name="twitter:image" content="https://bijaysoti.com/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Bijay Soti",
            "jobTitle": "Full Stack Developer",
            "url": "https://bijaysoti.com",
            "sameAs": [
              "https://linkedin.com/in/bijaysoti",
              "https://github.com/bijaysoti",
              "https://twitter.com/bijaysoti"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kathmandu",
              "addressCountry": "Nepal"
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
