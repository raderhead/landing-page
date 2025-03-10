
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
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 to-luxury-charcoal/90 z-10"></div>
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/lovable-uploads/abilene-skyline.mp4" type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img src="/lovable-uploads/452f8926-d28f-4549-93ac-40a82a160575.png" alt="Abilene Downtown Skyline" className="w-full h-full object-cover object-center" />
        </video>
      </div>
      
      <div className="container relative z-20 flex md:flex-row flex-col items-center">
        <div className="max-w-2xl md:mr-12 mb-20">
          <div className="flex items-center gap-2 text-luxury-khaki mb-4 opacity-0 animate-fade-in">
            <div className="inline-flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-luxury-gold" />
              <span className="text-sm font-medium tracking-wide">Abilene, Texas</span>
            </div>
            <span className="text-luxury-khaki/50">|</span>
            <span className="text-sm font-medium tracking-wide text-luxury-khaki">Trusted by 50+ Investors & Businesses</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 opacity-0 animate-fade-in-delay-1 leading-tight">
            <span className="font-sans">Elevate Your</span><br/>
            <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-gold hover-glow inline-block">Commercial Investment</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl opacity-0 animate-fade-in-delay-2 leading-relaxed">
            Josh Rader is a licensed commercial real estate agent specializing in helping businesses and investors find premium locations in Abilene.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-delay-3">
            <Button
              size="lg"
              variant="default"
              className="bg-luxury-gold/90 backdrop-blur-sm text-luxury-dark rounded-sm px-8 
                hover:bg-luxury-gold hover:text-luxury-dark hover:scale-105 
                transition-all duration-300 group shadow-[0_0_10px_rgba(212,184,123,0.2)]
                hover:shadow-[0_0_15px_rgba(212,184,123,0.5)]"
              asChild
            >
              <Link to="/properties">
                <Search className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Browse Prime Listings
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border border-white/10 backdrop-blur-lg rounded-sm px-8 
                bg-white/5 text-white hover:bg-white/10 hover:text-luxury-gold 
                hover:scale-105 transition-all duration-300 group
                hover:shadow-[0_0_15px_rgba(212,184,123,0.3)]"
            >
              <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform text-luxury-gold" />
              Book Your Strategy Call
            </Button>
          </div>
        </div>
        
        {/* Add Josh Rader's Photo */}
        <div className="hidden md:block w-64 h-80 rounded-sm overflow-hidden shadow-xl opacity-0 animate-fade-in-delay-3">
          <img 
            src="/lovable-uploads/bd4ad840-cf8b-4ffb-a39b-d42c5ab101a0.jpg" 
            alt="Josh Rader" 
            className="w-full h-full object-cover object-center hover-scale"
          />
        </div>
      </div>
      
      {/* Stats banner - Moved from absolute positioning to normal flow at the bottom of the section */}
      <div className="bg-luxury-dark/80 backdrop-blur-lg py-8 z-20 border-t border-luxury-khaki/20 w-full absolute bottom-0 left-0 right-0">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold font-serif">10+ Years</p>
            <p className="text-luxury-khaki">Experience in
Commercial Real Estate</p>
          </div>
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold font-serif">$50M+</p>
            <p className="text-luxury-khaki">In Closed Transactions</p>
          </div>
          <div className="text-center hover-lift p-4">
            <p className="text-3xl font-bold text-luxury-gold font-serif">100+</p>
            <p className="text-luxury-khaki">Satisfied Clients</p>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
