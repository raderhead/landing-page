import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building, CheckCircle, Briefcase, BadgeDollarSign, Key, Percent, FileCheck } from "lucide-react";
import { useRef, useEffect, useState } from 'react';

const AboutSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <section id="about" ref={sectionRef} className="section bg-luxury-black text-white relative overflow-hidden py-0">
      <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-luxury-gold/5 parallax-layer" style={{
      transform: `translateY(${scrollY * 0.03}px)`
    }}>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-luxury-gold/5 parallax-layer" style={{
      transform: `translateY(${-scrollY * 0.02}px)`
    }}>
      </div>
      
      <div className="container relative z-10 py-[45px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div style={{
          transform: `translateY(${(scrollY - 1800) * 0.03}px)`
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Who is Josh Rader?</h2>
            <p className="text-lg mb-6 text-white leading-relaxed">
              Josh Rader is an experienced, licensed Texas real estate agent specializing in commercial properties across Abilene and surrounding areas.
            </p>
            
            <div className="mb-6 text-white space-y-4">
              <p className="leading-relaxed">
                As a multi-business owner (Bodegish, Firehouse Fitness, and others), he deeply understands commercial spaces and helps investors and businesses strategically select and maximize their properties.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start group hover-lift">
                <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Licensed Texas Real Estate Agent</span>
              </div>
              <div className="flex items-start group hover-lift">
                <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Commercial Property Specialist</span>
              </div>
              <div className="flex items-start group hover-lift">
                <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Investment Property Expert</span>
              </div>
              <div className="flex items-start group hover-lift">
                <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Abilene Market Knowledge</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-luxury-charcoal px-4 py-2 rounded-sm hover-lift hover:bg-luxury-charcoal/70 group">
                <Award className="h-5 w-5 text-luxury-gold mr-2 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Abilene's Top 20 Under 40 | Class of 2016</span>
              </div>
              <div className="flex items-center bg-luxury-charcoal px-4 py-2 rounded-sm hover-lift hover:bg-luxury-charcoal/70 group">
                <Briefcase className="h-5 w-5 text-luxury-gold mr-2 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Recognized Business Owner by State and National Congressman</span>
              </div>
              <div className="flex items-center bg-luxury-charcoal px-4 py-2 rounded-sm hover-lift hover:bg-luxury-charcoal/70 group">
                <Building className="h-5 w-5 text-luxury-gold mr-2 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">2023 Young Entrepreneur of the Year</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-luxury-gold">Board Memberships</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start group hover-lift">
                  <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">Board Member - Abilene Convention and Visitor's Bureau</span>
                </div>
                <div className="flex items-start group hover-lift">
                  <CheckCircle className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">Board Member - Abilene Board of Adjustments</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-luxury-gold">Financing Expertise</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start group hover-lift">
                  <BadgeDollarSign className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">10+ Years as a Commercial Real Estate Investor</span>
                </div>
                <div className="flex items-start group hover-lift">
                  <FileCheck className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">SBA Acquisition Experience</span>
                </div>
                <div className="flex items-start group hover-lift">
                  <Key className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">Owner Financing Experience</span>
                </div>
                <div className="flex items-start group hover-lift">
                  <Percent className="h-5 w-5 text-luxury-gold mr-2 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-luxury-gold transition-colors">Conventional Loan Experience</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={scrollToContact}
              className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black border-none rounded-sm hover-scale group"
            >
              Contact Josh Today
            </Button>
          </div>
          
          <div className="relative" style={{
          transform: `translateY(${(scrollY - 1800) * -0.03}px)`
        }}>
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-luxury-gold rounded-md hover:border-luxury-khaki transition-colors duration-500"></div>
            <img 
              alt="Josh Rader, Commercial Real Estate Agent in Abilene" 
              className="w-full h-auto rounded-md relative z-10 shadow-xl hover:shadow-luxury-gold/30 transition-shadow duration-500" 
              src="/lovable-uploads/bd4ad840-cf8b-4ffb-a39b-d42c5ab101a0.jpg" 
            />
          </div>
        </div>
      </div>
    </section>;
};

export default AboutSection;
