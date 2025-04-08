
import { Building, Store, Warehouse, Building2, BarChart4, Handshake } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const services = [{
  icon: <Store className="h-12 w-12 text-luxury-gold" />,
  title: "Retail Leasing",
  description: "Discover prime retail leasing spaces in Abilene's busiest commercial districts with high foot traffic and excellent visibility."
}, {
  icon: <Building className="h-12 w-12 text-luxury-gold" />,
  title: "Office Leasing",
  description: "Premium office spaces available for lease in Abilene to fit diverse business needs and budgets in desirable locations."
}, {
  icon: <Warehouse className="h-12 w-12 text-luxury-gold" />,
  title: "Industrial Properties",
  description: "High-quality warehouses and industrial properties for lease or sale in Abilene with strategic access to major transportation routes."
}, {
  icon: <Building2 className="h-12 w-12 text-luxury-gold" />,
  title: "Property Investment",
  description: "Strategic commercial real estate investment opportunities in Abilene's growing market with potential for strong returns."
}, {
  icon: <BarChart4 className="h-12 w-12 text-luxury-gold" />,
  title: "Market Analysis",
  description: "Comprehensive commercial real estate market analyses tailored specifically for Abilene investors and property owners."
}, {
  icon: <Handshake className="h-12 w-12 text-luxury-gold" />,
  title: "Buyer/Seller Representation",
  description: "Experienced guidance for buying and selling commercial real estate properties in Abilene with expert negotiation services."
}];

const ServicesSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Configure embla carousel with autoplay plugin for very slow continuous scrolling
  const autoplayOptions = {
    delay: 0,              // No delay between slides
    stopOnInteraction: false, // Don't stop on user interaction
    stopOnMouseEnter: false,  // Don't stop on mouse hover
    playOnInit: true       // Start playing immediately
  };
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1,
      duration: 10000,      // Updated to 10,000ms for extremely slow transition speed
      dragFree: true       // Enables momentum scrolling
    },
    [Autoplay(autoplayOptions)]
  );
  
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
  
  return <section id="services" ref={sectionRef} className="section bg-luxury-dark relative overflow-hidden py-[45px]">
      {/* Subtle Parallax Background Elements */}
      <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-luxury-gold/5 -translate-x-1/2 parallax-layer" style={{
        transform: `translateX(${scrollY * 0.05}px) translateY(${scrollY * 0.02}px)`
      }}>
      </div>
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-luxury-gold/5 translate-x-1/2 parallax-layer" style={{
        transform: `translateX(${-scrollY * 0.04}px) translateY(${-scrollY * 0.01}px)`
      }}>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title text-white font-sans">Premium Real Estate <span className="font-serif text-luxury-gold">Services</span></h2>
          <p className="section-subtitle text-white font-sans">
            Comprehensive services to meet all your commercial property needs in Abilene and surrounding areas
          </p>
        </div>
        
        {/* Infinite Carousel */}
        <div className="mx-auto max-w-6xl relative px-4">
          <div className="relative" ref={emblaRef}>
            <div className="flex">
              {/* Duplicate the services at the beginning for smoother loop transition */}
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] px-4"
                >
                  <div 
                    className="bg-luxury-charcoal p-8 rounded-md shadow-md hover:shadow-lg transition-all duration-500 
                    border border-white/10 hover:border-luxury-gold/30 hover:bg-luxury-charcoal/80 hover:-translate-y-2 h-full"
                  >
                    <div className="mb-4 transform transition-transform duration-500 hover:scale-110 hover:text-luxury-gold">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white hover:text-luxury-gold transition-colors font-sans">
                      {service.title}
                    </h3>
                    <p className="text-white font-sans">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custom Navigation Buttons */}
          <button 
            onClick={() => emblaApi?.scrollPrev()} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-luxury-dark/80 hover:bg-luxury-gold/20 text-luxury-gold p-2 rounded-full
            transition-all duration-300 -ml-4 opacity-70 hover:opacity-100 focus:outline-none hidden md:flex"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            onClick={() => emblaApi?.scrollNext()} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-luxury-dark/80 hover:bg-luxury-gold/20 text-luxury-gold p-2 rounded-full
            transition-all duration-300 -mr-4 opacity-70 hover:opacity-100 focus:outline-none hidden md:flex"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        
        {/* Removed the dots pagination indicator that was here */}
      </div>
    </section>;
};

export default ServicesSection;
