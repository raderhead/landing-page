
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PropertiesSection from "@/components/PropertiesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Josh Rader - Commercial Real Estate Agent | Abilene, TX</title>
        <meta name="description" content="Josh Rader - Licensed Commercial Real Estate Agent serving Abilene, TX and surrounding areas. Specializing in commercial property sales, leasing, investments, and property management with local expertise." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <PropertiesSection />
          <AboutSection />
          <TestimonialsSection />
          <BlogsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
