
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Building, Search, Grid, List, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

type Property = {
  id: string;
  title: string;
  address: string;
  type: string;
  size: string;
  price: string;
  image_url: string;
  mls?: string;
};

type PropertyType = "All" | "Office" | "Retail" | "Industrial" | "Other";

const AllProperties = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('received_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties:', error);
          setProperties([]);
        } else {
          const formattedProperties = data.map((property: any): Property => ({
            id: property.id,
            title: property.title || 'Untitled Property',
            address: property.address || 'No Address Provided',
            type: property.type || 'Other',
            size: property.size || 'Unknown',
            price: property.price || 'Contact for Price',
            image_url: property.image_url || '',
            mls: property.mls
          }));
          
          setProperties(formattedProperties);
        }
      } catch (error) {
        console.error('Error in properties fetch:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  useEffect(() => {
    let filtered = properties;
    
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (propertyType !== "All") {
      filtered = filtered.filter(property => property.type === propertyType);
    }
    
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [searchTerm, propertyType, properties]);
  
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <section className="relative pt-28 pb-12 bg-luxury-black overflow-hidden">
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&q=80" 
            alt="Commercial Properties in Abilene" 
            className="w-full h-full object-cover" 
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mb-6">
            <a href="/" className="flex items-center gap-2 text-luxury-khaki mb-6 group hover:text-luxury-gold transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="font-sans">Commercial Properties in</span> <span className="text-luxury-gold font-serif">Abilene</span>
            </h1>
            
            <p className="text-luxury-khaki text-base font-sans">
              Browse our curated selection of premium commercial real estate opportunities in the Abilene market.
            </p>
          </div>
          
          <div className="bg-luxury-dark p-3 border border-luxury-khaki/20 rounded-md shadow-lg flex flex-col md:flex-row gap-3 animate-fade-in-delay-1">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-luxury-khaki" />
              <Input 
                placeholder="Search properties by name or address" 
                className="pl-10 bg-luxury-black border-luxury-khaki/30 text-white placeholder:text-luxury-khaki/50 hover:border-luxury-gold/50 focus:border-luxury-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`rounded-full px-3 py-0 border-luxury-khaki/30 ${propertyType === 'All' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("All")}
              >
                All
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-luxury-khaki/30 ${propertyType === 'Office' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Office")}
              >
                Office
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-luxury-khaki/30 ${propertyType === 'Retail' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Retail")}
              >
                Retail
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-luxury-khaki/30 ${propertyType === 'Industrial' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Industrial")}
              >
                Industrial
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-luxury-khaki/30 ${propertyType === 'Other' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Other")}
              >
                Other
              </Button>
            </div>
            
            <div className="flex gap-1 border-l border-luxury-khaki/20 pl-3 items-center">
              <Button 
                variant="ghost"
                size="sm"
                className={`p-1 ${viewMode === 'grid' ? 'text-luxury-gold' : 'text-luxury-khaki hover:text-luxury-gold'}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`p-1 ${viewMode === 'list' ? 'text-luxury-gold' : 'text-luxury-khaki hover:text-luxury-gold'}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-10 bg-black">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 text-luxury-gold animate-spin mb-3" />
            <p className="text-luxury-khaki">Loading properties...</p>
          </div>
        ) : currentProperties.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {currentProperties.map((property, index) => (
                    <div 
                      key={property.id} 
                      className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:shadow-luxury-gold/20 hover:-translate-y-1 hover:scale-[1.01] border border-luxury-khaki/10 group h-[420px]"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: `translateY(${Math.min(10, Math.max(-10, (scrollY - 1200) * 0.02 * (index % 3 - 1)))}px)`
                      }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        {property.image_url ? (
                          <img 
                            src={property.image_url} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-luxury-dark/50 flex items-center justify-center">
                            <Building className="h-12 w-12 text-luxury-gold/20" />
                          </div>
                        )}
                        {property.type && (
                          <div className="absolute top-2 right-2 bg-luxury-gold text-luxury-black py-1 px-2 rounded-sm text-xs font-medium">
                            {property.type}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col h-[calc(420px-256px)] justify-between">
                        <div>
                          {property.price && (
                            <p className="font-bold text-luxury-gold text-3xl mb-2 leading-tight">{property.price}</p>
                          )}
                          <h3 className="text-sm font-medium text-white mb-1 truncate">{property.title}</h3>
                          
                          {property.address && (
                            <div className="flex items-center text-luxury-khaki mb-3">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0 group-hover:text-luxury-gold transition-colors" />
                              <span className="text-xs truncate">{property.address}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {property.mls && (
                            <div className="mb-3">
                              <p className="text-xs text-luxury-khaki/70">MLS</p>
                              <p className="font-medium text-white text-sm">{property.mls}</p>
                            </div>
                          )}
                          
                          <Button variant="outline" className="w-full text-xs py-1 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="container space-y-4">
                {currentProperties.map((property, index) => (
                  <div 
                    key={property.id} 
                    className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:shadow-luxury-gold/20 border border-luxury-khaki/10 group"
                    style={{ 
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="relative md:col-span-2 h-48 md:h-auto overflow-hidden">
                        {property.image_url ? (
                          <img 
                            src={property.image_url} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-luxury-dark/50 flex items-center justify-center">
                            <Building className="h-12 w-12 text-luxury-gold/20" />
                          </div>
                        )}
                        
                        {property.type && (
                          <div className="absolute top-2 right-2 bg-luxury-gold text-luxury-black py-1 px-2 rounded-sm text-xs font-medium">
                            {property.type}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 md:col-span-3 flex flex-col justify-between">
                        <div>
                          {property.price && (
                            <p className="font-bold text-luxury-gold text-3xl mb-2 leading-tight">{property.price}</p>
                          )}
                          <h3 className="text-sm font-medium text-white mb-1">{property.title}</h3>
                          {property.address && (
                            <div className="flex items-center text-luxury-khaki mb-3">
                              <MapPin className="h-3 w-3 mr-1 group-hover:text-luxury-gold transition-colors" />
                              <span className="text-xs">{property.address}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                            {property.size && property.size !== 'Unknown' && (
                              <div>
                                <p className="text-xs text-luxury-khaki/70">Size</p>
                                <p className="font-medium text-white text-sm">{property.size}</p>
                              </div>
                            )}
                            
                            {property.mls && (
                              <div>
                                <p className="text-xs text-luxury-khaki/70">MLS</p>
                                <p className="font-medium text-white text-sm">{property.mls}</p>
                              </div>
                            )}
                          </div>
                          
                          <Button variant="outline" className="w-fit text-sm px-6 h-9 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-8 container">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        className={`border-luxury-khaki/30 text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          className={`${currentPage === i + 1 ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-luxury-khaki/30 text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                          onClick={() => paginate(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        className={`border-luxury-khaki/30 text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 container">
            <Building className="mx-auto h-12 w-12 text-luxury-khaki/30 mb-3" />
            <h3 className="text-xl font-bold text-luxury-gold mb-2">No properties found</h3>
            <p className="text-luxury-khaki mb-4">Try adjusting your search criteria or browse all properties.</p>
            <Button 
              variant="outline" 
              className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm"
              onClick={() => {
                setSearchTerm("");
                setPropertyType("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default AllProperties;
