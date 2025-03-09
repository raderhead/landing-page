import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building, CheckCircle, Briefcase, BadgeDollarSign, Key, Percent, FileCheck } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
const AboutSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
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
      {/* Subtle Parallax Background Elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-luxury-gold/5 parallax-layer" style={{
      transform: `translateY(${scrollY * 0.03}px)`
    }}>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-luxury-gold/5 parallax-layer" style={{
      transform: `translateY(${-scrollY * 0.02}px)`
    }}>
      </div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div style={{
          transform: `translateY(${(scrollY - 1800) * 0.03}px)`
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Who is Josh Rader?</h2>
            <p className="text-lg mb-6 text-white/80 leading-relaxed">
              With over 10 years of experience in the Abilene commercial real estate market, Josh Rader has established himself as a trusted advisor to businesses, investors, and property owners throughout the region.
            </p>
            
            <div className="mb-6 text-white/80 space-y-4">
              <p className="leading-relaxed">
                As a multi-business owner, Josh brings firsthand experience in choosing and operating commercial spaces. From launching Bodegish, Firehouse Fitness, and multiple other businesses, he understands what it takes for businesses to thrive in the right location.
              </p>
              <p className="leading-relaxed">
                Josh specializes in commercial real estate, helping business owners find the right space and working with investors to identify smart commercial property opportunities. His deep understanding of business operations and market trends makes him a valuable resource for those looking to lease, buy, or invest.
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
                <span className="group-hover:text-luxury-gold transition-colors">Top Producer 2022</span>
              </div>
              <div className="flex items-center bg-luxury-charcoal px-4 py-2 rounded-sm hover-lift hover:bg-luxury-charcoal/70 group">
                <Briefcase className="h-5 w-5 text-luxury-gold mr-2 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">Multiple Business Owner</span>
              </div>
              <div className="flex items-center bg-luxury-charcoal px-4 py-2 rounded-sm hover-lift hover:bg-luxury-charcoal/70 group">
                <Building className="h-5 w-5 text-luxury-gold mr-2 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-luxury-gold transition-colors">100+ Transactions</span>
              </div>
            </div>
            
            {/* New financing experience section */}
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
            
            <Button className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black border-none rounded-sm hover-scale group">
              Learn More About Josh
            </Button>
          </div>
          
          <div className="relative" style={{
          transform: `translateY(${(scrollY - 1800) * -0.03}px)`
        }}>
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-luxury-gold rounded-md hover:border-luxury-khaki transition-colors duration-500"></div>
            <img alt="Josh Rader, Commercial Real Estate Agent" className="w-full h-auto rounded-md relative z-10 shadow-xl hover:shadow-luxury-gold/30 transition-shadow duration-500" src="/lovable-uploads/bd4ad840-cf8b-4ffb-a39b-d42c5ab101a0.jpg" />
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;