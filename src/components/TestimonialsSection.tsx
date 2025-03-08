
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Josh helped us find the perfect retail location for our business. His knowledge of the Abilene market was invaluable and saved us countless hours.",
    name: "Sarah Johnson",
    title: "Owner, Abilene Boutique",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "As an investor new to commercial real estate, Josh provided expert guidance that helped me build a profitable portfolio of properties in Abilene.",
    name: "Michael Rodriguez",
    title: "Real Estate Investor",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    quote: "When we needed to expand our office space, Josh understood our requirements perfectly and found us a property that exceeded our expectations.",
    name: "Lisa Thompson",
    title: "CEO, Thompson Consulting",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="section bg-realestate-light">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">What Clients Say</h2>
          <p className="section-subtitle">
            Hear from businesses and investors who have worked with Josh to find their ideal commercial properties
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md relative"
            >
              <Quote className="h-10 w-10 text-realestate-accent/20 absolute top-6 right-6" />
              <p className="text-realestate-gray mb-6 relative z-10">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold text-realestate-navy">{testimonial.name}</p>
                  <p className="text-sm text-realestate-gray">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
