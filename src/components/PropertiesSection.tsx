
import { useRef, useEffect, useState } from 'react';

const PropertiesSection = () => {
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
  
  return <section id="properties" ref={sectionRef} className="section bg-black relative overflow-hidden py-[45px]">
      <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-luxury-gold/5 -translate-x-1/2 parallax-layer" style={{
      transform: `translateX(${scrollY * 0.03}px) translateY(${scrollY * 0.02}px)`
    }}>
      </div>
      <div className="absolute bottom-20 right-0 w-40 h-40 rounded-full bg-luxury-gold/10 translate-x-1/2 parallax-layer" style={{
      transform: `translateX(${-scrollY * 0.04}px) translateY(${-scrollY * 0.01}px)`
    }}>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title text-white font-sans">Featured <span className="font-serif text-luxury-gold">Properties</span></h2>
          <p className="section-subtitle text-luxury-khaki font-sans">
            Explore our selection of premium commercial properties available in Abilene, TX
          </p>
        </div>
        
        <div className="w-full bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-luxury-gold/10 hover:border-luxury-gold/20 transition-all duration-300">
          <iframe 
            src="https://www.immobel.com/Josh" 
            width="100%" 
            height="800px" 
            className="border-0"
            title="Josh Rader IDX Property Listings"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>;
};

export default PropertiesSection;
