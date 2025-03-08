
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, MapPin, Phone } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-realestate-navy/95 to-realestate-blue/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80" 
          alt="Commercial building in Abilene" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-white/90 mb-4 opacity-0 animate-fade-in">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Abilene, TX Commercial Real Estate</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0 animate-fade-in-delay-1">
            Find Your Next <span className="text-realestate-accent">Commercial Property</span> in Abilene
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl opacity-0 animate-fade-in-delay-2">
            Josh Rader is a licensed commercial real estate agent specializing in helping businesses find the perfect location in Abilene and the surrounding areas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-delay-3">
            <Button size="lg" className="bg-realestate-accent hover:bg-realestate-accent/90 text-white">
              View Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-6 shadow-lg z-20">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-realestate-blue">10+ Years</p>
            <p className="text-realestate-gray">Experience in Abilene</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-realestate-blue">$50M+</p>
            <p className="text-realestate-gray">In Closed Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-realestate-blue">100+</p>
            <p className="text-realestate-gray">Satisfied Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
