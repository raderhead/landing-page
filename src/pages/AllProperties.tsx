
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Building, Search, Grid, List, ArrowLeft } from "lucide-react";

// Placeholder data until IDX integration
const placeholderProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Downtown Office Building",
    address: "123 Pine Street, Abilene, TX",
    type: "Office",
    size: "5,000 sq ft",
    price: "$1,200,000"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Retail Space on Main",
    address: "456 Main Street, Abilene, TX",
    type: "Retail",
    size: "2,500 sq ft",
    price: "$3,500/month"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1623298460174-371443cc454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Industrial Warehouse",
    address: "789 Industry Blvd, Abilene, TX",
    type: "Industrial",
    size: "12,000 sq ft",
    price: "$850,000"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1542889601-399c4f3a8402?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Modern Office Complex",
    address: "101 Business Park, Abilene, TX",
    type: "Office",
    size: "8,200 sq ft",
    price: "$2,100,000"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Prime Retail Location",
    address: "202 Commercial Avenue, Abilene, TX",
    type: "Retail",
    size: "3,800 sq ft",
    price: "$4,200/month"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Warehouse with Office",
    address: "303 Distribution Way, Abilene, TX",
    type: "Industrial",
    size: "15,500 sq ft",
    price: "$1,250,000"
  }
];

type PropertyType = "All" | "Office" | "Retail" | "Industrial";

const AllProperties = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [properties, setProperties] = useState(placeholderProperties);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Filter properties based on search term and property type
  useEffect(() => {
    let filtered = placeholderProperties;
    
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (propertyType !== "All") {
      filtered = filtered.filter(property => property.type === propertyType);
    }
    
    setProperties(filtered);
  }, [searchTerm, propertyType]);
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 bg-luxury-black overflow-hidden">
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
          <div className="max-w-3xl mb-8">
            <a href="/" className="flex items-center gap-2 text-luxury-khaki mb-8 group hover:text-luxury-gold transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="font-sans">Commercial Properties in</span> <span className="text-luxury-gold font-serif">Abilene</span>
            </h1>
            
            <p className="text-luxury-khaki text-lg font-sans">
              Browse our curated selection of premium commercial real estate opportunities in the Abilene market.
            </p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="bg-luxury-dark p-4 border border-luxury-khaki/20 rounded-md shadow-lg flex flex-col md:flex-row gap-4 animate-fade-in-delay-1">
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
                className={`rounded-full px-4 border-luxury-khaki/30 ${propertyType === 'All' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("All")}
              >
                All
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-full px-4 border-luxury-khaki/30 ${propertyType === 'Office' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Office")}
              >
                Office
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-full px-4 border-luxury-khaki/30 ${propertyType === 'Retail' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Retail")}
              >
                Retail
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-full px-4 border-luxury-khaki/30 ${propertyType === 'Industrial' ? 'bg-luxury-gold text-luxury-black border-luxury-gold' : 'text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold'}`}
                onClick={() => setPropertyType("Industrial")}
              >
                Industrial
              </Button>
            </div>
            
            <div className="flex gap-1 border-l border-luxury-khaki/20 pl-4 items-center">
              <Button 
                variant="ghost"
                className={`p-2 ${viewMode === 'grid' ? 'text-luxury-gold' : 'text-luxury-khaki hover:text-luxury-gold'}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost"
                className={`p-2 ${viewMode === 'list' ? 'text-luxury-gold' : 'text-luxury-khaki hover:text-luxury-gold'}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Properties Grid */}
      <section className="py-12 bg-black">
        <div className="container">
          {properties.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property, index) => (
                    <div 
                      key={property.id} 
                      className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:shadow-luxury-gold/20 hover:-translate-y-2 hover:scale-[1.02] border border-luxury-khaki/10 group"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: `translateY(${Math.min(20, Math.max(-20, (scrollY - 1200) * 0.03 * (index % 3 - 1)))}px)`
                      }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black py-1 px-3 rounded-sm text-sm font-medium group-hover:scale-110 transition-transform">
                          {property.type}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-luxury-gold transition-colors">{property.title}</h3>
                        <div className="flex items-center text-luxury-khaki mb-4">
                          <MapPin className="h-4 w-4 mr-1 group-hover:text-luxury-gold transition-colors" />
                          <span className="text-sm">{property.address}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-luxury-khaki/70">Size</p>
                            <p className="font-medium text-white">{property.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-luxury-khaki/70">Price</p>
                            <p className="font-medium text-white">{property.price}</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {properties.map((property, index) => (
                    <div 
                      key={property.id} 
                      className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:shadow-luxury-gold/20 border border-luxury-khaki/10 group"
                      style={{ 
                        transitionDelay: `${index * 50}ms`
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="relative md:col-span-1 h-48 md:h-full overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black py-1 px-3 rounded-sm text-sm font-medium group-hover:scale-110 transition-transform">
                            {property.type}
                          </div>
                        </div>
                        
                        <div className="p-6 md:col-span-3 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-luxury-gold transition-colors">{property.title}</h3>
                            <div className="flex items-center text-luxury-khaki mb-4">
                              <MapPin className="h-4 w-4 mr-1 group-hover:text-luxury-gold transition-colors" />
                              <span className="text-sm">{property.address}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                              <p className="text-sm text-luxury-khaki/70">Size</p>
                              <p className="font-medium text-white">{property.size}</p>
                            </div>
                            <div>
                              <p className="text-sm text-luxury-khaki/70">Price</p>
                              <p className="font-medium text-white">{property.price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-luxury-khaki/70">Type</p>
                              <p className="font-medium text-white">{property.type}</p>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-fit border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm group-hover:bg-luxury-gold/10 transition-all">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* IDX integration note - this will be replaced with actual pagination from IDX */}
              <div className="mt-12 text-center">
                <p className="text-luxury-khaki mb-4">Showing {properties.length} of {properties.length} properties</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" className="border-luxury-khaki/30 text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="border-luxury-gold bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black">
                    1
                  </Button>
                  <Button variant="outline" className="border-luxury-khaki/30 text-luxury-khaki hover:border-luxury-gold hover:text-luxury-gold" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Building className="mx-auto h-16 w-16 text-luxury-khaki/30 mb-4" />
              <h3 className="text-2xl font-bold text-luxury-gold mb-2">No properties found</h3>
              <p className="text-luxury-khaki mb-6">Try adjusting your search criteria or browse all properties.</p>
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
        </div>
      </section>
      
      {/* IDX Integration Note - This section will be hidden in production */}
      <section className="py-10 bg-luxury-black border-t border-luxury-khaki/10">
        <div className="container">
          <div className="bg-luxury-dark p-6 rounded-md border border-luxury-gold/20">
            <h3 className="text-xl font-bold text-luxury-gold mb-4">Integration Note</h3>
            <p className="text-luxury-khaki mb-4">
              This page is designed to be integrated with your IDX provider. The placeholder data shown here will be replaced with live listings from your MLS feed once the IDX integration is complete.
            </p>
            <div className="text-luxury-khaki/70 text-sm">
              <p>Considerations for IDX integration:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Property search and filtering will be powered by the IDX API</li>
                <li>Pagination will display real property counts from your MLS</li>
                <li>Property details pages will be dynamically created for each listing</li>
                <li>Property images will be sourced from the MLS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AllProperties;
