
import { Button } from "@/components/ui/button";
import { MapPin, Building, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const properties = [{
  image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  title: "Downtown Office Building",
  address: "123 Pine Street, Abilene, TX",
  type: "Office",
  size: "5,000 sq ft",
  price: "$1,200,000"
}, {
  image: "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  title: "Retail Space on Main",
  address: "456 Main Street, Abilene, TX",
  type: "Retail",
  size: "2,500 sq ft",
  price: "$3,500/month"
}, {
  image: "https://images.unsplash.com/photo-1623298460174-371443cc454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  title: "Industrial Warehouse",
  address: "789 Industry Blvd, Abilene, TX",
  type: "Industrial",
  size: "12,000 sq ft",
  price: "$850,000"
}];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => <div key={index} className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:shadow-luxury-gold/20 hover:-translate-y-2 hover:scale-[1.02] border border-luxury-khaki/10 group" style={{
          transitionDelay: `${index * 50}ms`,
          transform: `translateY(${Math.min(20, Math.max(-20, (scrollY - 1200) * 0.03 * (index % 3 - 1)))}px)`
        }}>
              <div className="relative h-64 overflow-hidden">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black py-1 px-3 rounded-sm text-sm font-medium group-hover:scale-110 transition-transform">
                  {property.type}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-luxury-gold transition-colors font-sans">{property.title}</h3>
                <div className="flex items-center text-luxury-khaki mb-4 font-sans">
                  <MapPin className="h-4 w-4 mr-1 group-hover:text-luxury-gold transition-colors" />
                  <span className="text-sm">{property.address}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 font-sans">
                  <div>
                    <p className="text-sm text-luxury-khaki/70">Size</p>
                    <p className="font-medium text-white">{property.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-khaki/70">Price</p>
                    <p className="font-medium text-white">{property.price}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all font-sans">
                  View Details
                </Button>
              </div>
            </div>)}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/properties">
            <Button variant="default" size="lg" className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black rounded-sm hover-scale group font-sans">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};

export default PropertiesSection;
