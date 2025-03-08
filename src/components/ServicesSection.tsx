
import { 
  Building, 
  Store, 
  Warehouse, 
  Building2, 
  BarChart4, 
  Handshake 
} from "lucide-react";

const services = [
  {
    icon: <Store className="h-12 w-12 text-realestate-blue" />,
    title: "Retail Leasing",
    description: "Find the perfect retail space for your business in high-traffic areas of Abilene."
  },
  {
    icon: <Building className="h-12 w-12 text-realestate-blue" />,
    title: "Office Leasing",
    description: "Professional office spaces that meet your business needs and budget."
  },
  {
    icon: <Warehouse className="h-12 w-12 text-realestate-blue" />,
    title: "Industrial Properties",
    description: "Warehouses and manufacturing spaces with the right specifications and location."
  },
  {
    icon: <Building2 className="h-12 w-12 text-realestate-blue" />,
    title: "Property Investment",
    description: "Identify lucrative commercial property investment opportunities in growing areas."
  },
  {
    icon: <BarChart4 className="h-12 w-12 text-realestate-blue" />,
    title: "Market Analysis",
    description: "In-depth analysis of the Abilene commercial real estate market to inform your decisions."
  },
  {
    icon: <Handshake className="h-12 w-12 text-realestate-blue" />,
    title: "Buyer/Seller Representation",
    description: "Expert negotiation and guidance throughout the buying or selling process."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="section bg-realestate-light">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Commercial Real Estate Services</h2>
          <p className="section-subtitle">
            Comprehensive services to meet all your commercial property needs in Abilene and surrounding areas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-realestate-navy">{service.title}</h3>
              <p className="text-realestate-gray">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
