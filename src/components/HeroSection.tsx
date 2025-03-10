
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone, Search } from "lucide-react";
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Only update parallax when section is visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-52 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 to-luxury-charcoal/90 z-10" style={{
        transform: `translateY(${scrollY * 0.1}px)`
      }}></div>
        <img src="/lovable-uploads/452f8926-d28f-4549-93ac-40a82a160575.png" alt="Abilene Downtown Skyline" className="w-full h-full object-cover" style={{
        transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0005})`
      }} />
      </div>
      
      <div className="container relative z-20">
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 text-luxury-khaki mb-4 opacity-0 animate-fade-in">
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 opacity-0 animate-fade-in-delay-1 leading-tight">
            Elevate Your <span className="text-luxury-gold hover-glow inline-block">Commercial Investment</span> in Abilene
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl opacity-0 animate-fade-in-delay-2 leading-relaxed">Josh Rader is a licensed commercial real estate agent specializing in helping businesses and investors find premium locations in Abilene.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-delay-3">
            <Button
              size="lg"
              variant="default"
              className="bg-luxury-gold text-luxury-dark rounded-sm px-8 hover:bg-luxury-khaki hover:text-luxury-dark hover:scale-105 transition-all duration-300 group"
              asChild
            >
              <Link to="/properties">
                <Search className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                View Properties
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white rounded-sm px-8 hover-border-glow text-slate-200 bg-zinc-950 hover:bg-zinc-800 hover:text-luxury-gold hover:scale-105 transition-all duration-300 group">
              <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform text-luxury-khaki group-hover:text-luxury-gold" />
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats banner - Moved from absolute positioning to normal flow at the bottom of the section */}
      <div className="bg-luxury-dark py-8 z-20 border-t border-luxury-khaki/20 w-full absolute bottom-0 left-0 right-0">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold">10+ Years</p>
            <p className="text-luxury-khaki">Experience in
Commercial Real Estate</p>
          </div>
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold">$50M+</p>
            <p className="text-luxury-khaki">In Closed Transactions</p>
          </div>
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold">100+</p>
            <p className="text-luxury-khaki">Satisfied Clients</p>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
