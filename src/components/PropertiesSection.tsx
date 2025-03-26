
import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: string;
  address: string;
  mls: string;
  price: string;
  image_url: string;
}

const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('address', { ascending: true });
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data || [];
};

const PropertiesSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });
  
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
  
  return (
    <section id="properties" ref={sectionRef} className="section bg-black relative overflow-hidden py-[45px]">
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
        
        <div className="w-full bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-luxury-gold/10 hover:border-luxury-gold/20 transition-all duration-300 min-h-[300px] p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-luxury-black/60 border-luxury-gold/10">
                  <CardContent className="p-4">
                    <Skeleton className="h-[200px] w-full mb-4 bg-luxury-gold/5" />
                    <Skeleton className="h-4 w-3/4 mb-2 bg-luxury-gold/5" />
                    <Skeleton className="h-4 w-1/2 mb-2 bg-luxury-gold/5" />
                    <Skeleton className="h-4 w-2/3 bg-luxury-gold/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-luxury-khaki">Error loading properties. Please try again later.</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="bg-luxury-black/60 border-luxury-gold/10 hover:border-luxury-gold/30 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      {property.image_url ? (
                        <img 
                          src={property.image_url} 
                          alt={property.address} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-luxury-gold/5">
                          <span className="text-luxury-khaki/50">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-1">{property.address}</h3>
                      <p className="text-luxury-gold font-serif text-lg">{property.price}</p>
                      {property.mls && (
                        <p className="text-luxury-khaki text-sm mt-1">MLS: {property.mls}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-luxury-khaki">No properties available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
