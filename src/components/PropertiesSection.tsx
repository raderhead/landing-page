
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin } from "lucide-react";

type Property = {
  id: string;
  address: string;
  mls: string;
  price: string;
  image_url: string;
};

const PropertiesSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch properties from Supabase
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties:', error);
          setProperties([]);
        } else {
          console.log('Properties loaded:', data?.length || 0);
          console.log('Sample property:', data && data.length > 0 ? data[0] : 'No properties');
          setProperties(data || []);
        }
      } catch (error) {
        console.error('Error in properties fetch:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
    
    // Set up a realtime subscription to update properties when new ones are added
    const channel = supabase
      .channel('public:properties')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'properties' }, 
        (payload) => {
          console.log('New property received:', payload.new);
          // Add the new property to the list
          setProperties(current => [payload.new as Property, ...current]);
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
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
        
        <div className="w-full rounded-lg overflow-hidden">
          {loading ? (
            <div className="bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-luxury-gold/10 min-h-[300px] flex items-center justify-center">
              <div className="text-luxury-gold animate-pulse">Loading properties...</div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="bg-luxury-dark/90 backdrop-blur-sm border-luxury-gold/10 hover:border-luxury-gold/20 transition-all duration-300 hover:shadow-lg group">
                  <div className="relative h-48 overflow-hidden">
                    {property.image_url ? (
                      <img 
                        src={property.image_url} 
                        alt={`MLS #${property.mls}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          // If image fails to load, show fallback
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-luxury-dark flex items-center justify-center">
                        <Building className="h-12 w-12 text-luxury-gold/20" />
                      </div>
                    )}
                    <div className="hidden absolute inset-0 w-full h-full bg-luxury-dark flex items-center justify-center">
                      <Building className="h-12 w-12 text-luxury-gold/20" />
                    </div>
                    <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black py-1 px-3 rounded-sm text-sm font-medium">
                      Commercial
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-luxury-gold transition-colors">MLS #{property.mls}</h3>
                    {property.address && (
                      <div className="flex items-center text-luxury-khaki mb-4">
                        <MapPin className="h-4 w-4 mr-1 group-hover:text-luxury-gold transition-colors" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                    )}
                    {property.price && (
                      <div className="mb-4">
                        <p className="text-sm text-luxury-khaki/70">Price</p>
                        <p className="font-medium text-white">{property.price}</p>
                      </div>
                    )}
                    <Button variant="outline" className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-luxury-gold/10 min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
              <Building className="h-16 w-16 text-luxury-gold/30 mb-4" />
              <h3 className="text-xl font-bold text-luxury-gold mb-2">No Properties Found</h3>
              <p className="text-luxury-khaki mb-4">
                Use the Webhook Tester to send property data to populate this section.
              </p>
              <Button 
                variant="outline" 
                className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
                onClick={() => window.location.href = '/webhooks'}
              >
                Go to Webhook Tester
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>;
};

export default PropertiesSection;
