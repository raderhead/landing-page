
import { Button } from "@/components/ui/button";
import { MapPin, Building, ArrowRight } from "lucide-react";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Downtown Office Building",
    address: "123 Pine Street, Abilene, TX",
    type: "Office",
    size: "5,000 sq ft",
    price: "$1,200,000"
  },
  {
    image: "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Retail Space on Main",
    address: "456 Main Street, Abilene, TX",
    type: "Retail",
    size: "2,500 sq ft",
    price: "$3,500/month"
  },
  {
    image: "https://images.unsplash.com/photo-1623298460174-371443cc454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Industrial Warehouse",
    address: "789 Industry Blvd, Abilene, TX",
    type: "Industrial",
    size: "12,000 sq ft",
    price: "$850,000"
  }
];

const PropertiesSection = () => {
  return (
    <section id="properties" className="section bg-black">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title text-white">Featured Properties</h2>
          <p className="section-subtitle text-luxury-khaki">
            Explore our selection of premium commercial properties available in Abilene, TX
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <div 
              key={index} 
              className="bg-luxury-dark rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-luxury-khaki/10"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black py-1 px-3 rounded-sm text-sm font-medium">
                  {property.type}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{property.title}</h3>
                <div className="flex items-center text-luxury-khaki mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
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
                
                <Button variant="outline" className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="default" size="lg" className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black rounded-sm">
            View All Properties
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
