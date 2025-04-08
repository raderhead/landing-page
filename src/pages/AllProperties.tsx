
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyDetailsDialog from "@/components/PropertyDetailsDialog";
import { Building, Search, Grid, List, ArrowLeft, Loader2 } from "lucide-react";
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
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPropertyId(null);
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
            <a href="/" className="flex items-center gap-2 text-white mb-6 group hover:text-[#1E5799] transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="font-sans">Commercial Properties in</span> <span className="text-[#1E5799] font-serif">Abilene</span>
            </h1>
            
            <p className="text-white text-base font-sans">
              Browse our curated selection of premium commercial real estate opportunities in the Abilene market.
            </p>
          </div>
          
          <div className="bg-luxury-dark p-3 border border-white/20 rounded-md shadow-lg flex flex-col md:flex-row gap-3 animate-fade-in-delay-1">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white" />
              <Input 
                placeholder="Search properties by name or address" 
                className="pl-10 bg-luxury-black border-white/30 text-white placeholder:text-white/50 hover:border-[#1E5799]/50 focus:border-[#1E5799]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`rounded-full px-3 py-0 border-white/30 ${propertyType === 'All' ? 'bg-[#1E5799] text-white border-[#1E5799]' : 'text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                onClick={() => setPropertyType("All")}
              >
                All
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-white/30 ${propertyType === 'Office' ? 'bg-[#1E5799] text-white border-[#1E5799]' : 'text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                onClick={() => setPropertyType("Office")}
              >
                Office
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-white/30 ${propertyType === 'Retail' ? 'bg-[#1E5799] text-white border-[#1E5799]' : 'text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                onClick={() => setPropertyType("Retail")}
              >
                Retail
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-white/30 ${propertyType === 'Industrial' ? 'bg-[#1E5799] text-white border-[#1E5799]' : 'text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                onClick={() => setPropertyType("Industrial")}
              >
                Industrial
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className={`rounded-full px-3 py-0 border-white/30 ${propertyType === 'Other' ? 'bg-[#1E5799] text-white border-[#1E5799]' : 'text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                onClick={() => setPropertyType("Other")}
              >
                Other
              </Button>
            </div>
            
            <div className="flex gap-1 border-l border-white/20 pl-3 items-center">
              <Button 
                variant="ghost"
                size="sm"
                className={`p-1 ${viewMode === 'grid' ? 'text-[#1E5799]' : 'text-white hover:text-[#1E5799]'}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`p-1 ${viewMode === 'list' ? 'text-[#1E5799]' : 'text-white hover:text-[#1E5799]'}`}
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
            <Loader2 className="h-10 w-10 text-[#1E5799] animate-spin mb-3" />
            <p className="text-white">Loading properties...</p>
          </div>
        ) : currentProperties.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {currentProperties.map((property, index) => (
                    <div 
                      key={property.id} 
                      className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:shadow-[#1E5799]/20 hover:-translate-y-1 hover:scale-[1.01] border border-white/10 group h-[400px] cursor-pointer"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: `translateY(${Math.min(10, Math.max(-10, (scrollY - 1200) * 0.02 * (index % 3 - 1)))}px)`
                      }}
                      onClick={() => handlePropertyClick(property.id)}
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
                            <Building className="h-12 w-12 text-[#1E5799]/20" />
                          </div>
                        )}
                        {property.type && (
                          <div className="absolute top-2 right-2 bg-[#1E5799] text-white py-1 px-2 rounded-sm text-xs font-medium">
                            {property.type}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col justify-between h-[calc(400px-256px)]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {property.price && (
                              <p className="font-serif font-bold text-[#1E5799] text-3xl mb-1 leading-tight tracking-tight">
                                {property.price.startsWith('$') ? property.price : `$${property.price}`}
                              </p>
                            )}
                            
                            {property.mls && (
                              <div>
                                <p className="text-xs text-white/70">MLS</p>
                                <p className="font-medium text-white text-sm">{property.mls}</p>
                              </div>
                            )}
                          </div>
                          
                          {property.address && (
                            <p className="text-base md:text-lg font-medium text-white font-serif tracking-wide">
                              {property.address}
                            </p>
                          )}
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
                    className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:shadow-[#1E5799]/20 border border-white/10 group cursor-pointer"
                    style={{ 
                      transitionDelay: `${index * 50}ms`
                    }}
                    onClick={() => handlePropertyClick(property.id)}
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
                            <Building className="h-12 w-12 text-[#1E5799]/20" />
                          </div>
                        )}
                        
                        {property.type && (
                          <div className="absolute top-2 right-2 bg-[#1E5799] text-white py-1 px-2 rounded-sm text-xs font-medium">
                            {property.type}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 md:col-span-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            {property.price && (
                              <p className="font-serif font-bold text-[#1E5799] text-3xl leading-tight tracking-tight">
                                {property.price.startsWith('$') ? property.price : `$${property.price}`}
                              </p>
                            )}
                            
                            {property.mls && (
                              <div>
                                <p className="text-xs text-white/70">MLS</p>
                                <p className="font-medium text-white text-sm">{property.mls}</p>
                              </div>
                            )}
                          </div>
                          
                          {property.address && (
                            <p className="text-base md:text-lg font-medium text-white mb-3 font-serif tracking-wide">
                              {property.address}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                            {property.size && property.size !== 'Unknown' && (
                              <div>
                                <p className="text-xs text-white/70">Size</p>
                                <p className="font-medium text-white text-sm">{property.size}</p>
                              </div>
                            )}
                          </div>
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
                        className={`border-white/30 text-white hover:border-[#1E5799] hover:text-[#1E5799] ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          className={`${currentPage === i + 1 ? 'border-[#1E5799] bg-[#1E5799]/10 text-[#1E5799]' : 'border-white/30 text-white hover:border-[#1E5799] hover:text-[#1E5799]'}`}
                          onClick={() => paginate(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        className={`border-white/30 text-white hover:border-[#1E5799] hover:text-[#1E5799] ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
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
            <Building className="mx-auto h-12 w-12 text-white/30 mb-3" />
            <h3 className="text-xl font-bold text-[#1E5799] mb-2">No properties found</h3>
            <p className="text-white mb-4">Try adjusting your search criteria or browse all properties.</p>
            <Button 
              variant="outline" 
              className="border-[#1E5799] text-[#1E5799] hover:bg-[#1E5799] hover:text-white rounded-sm"
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
      
      {/* Property Details Dialog */}
      <PropertyDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        propertyId={selectedPropertyId} 
      />
      
      <Footer />
    </div>
  );
};

export default AllProperties;
