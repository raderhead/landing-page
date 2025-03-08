
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/95 to-luxury-charcoal/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&q=80" 
          alt="Luxury Commercial Building in Abilene" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-luxury-khaki mb-4 opacity-0 animate-fade-in">
            <MapPin className="h-5 w-5" />
            <span className="font-medium uppercase tracking-wider text-sm">Abilene, TX Commercial Real Estate</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 opacity-0 animate-fade-in-delay-1 leading-tight">
            Elevate Your <span className="text-luxury-gold">Commercial Investment</span> in Abilene
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl opacity-0 animate-fade-in-delay-2 leading-relaxed">
            Josh Rader is a licensed commercial real estate agent specializing in helping businesses and investors find premium locations in Abilene and the surrounding areas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-delay-3">
            <Button size="lg" className="bg-luxury-gold hover:bg-luxury-khaki text-luxury-black rounded-sm px-8">
              View Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-sm px-8">
              <Phone className="mr-2 h-5 w-5" />
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-luxury-dark py-8 z-20 border-t border-luxury-khaki/20">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-luxury-gold">10+ Years</p>
            <p className="text-luxury-khaki">Experience in Abilene</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-luxury-gold">$50M+</p>
            <p className="text-luxury-khaki">In Closed Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-luxury-gold">100+</p>
            <p className="text-luxury-khaki">Satisfied Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
