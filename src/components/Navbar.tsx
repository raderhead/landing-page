
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Building, Menu, X, Phone } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <nav className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-realestate-blue">
          <Building className="h-8 w-8" />
          <span className="font-bold text-xl">Josh Rader</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-realestate-navy hover:text-realestate-accent font-medium transition-colors">Services</a>
          <a href="#properties" className="text-realestate-navy hover:text-realestate-accent font-medium transition-colors">Properties</a>
          <a href="#about" className="text-realestate-navy hover:text-realestate-accent font-medium transition-colors">About</a>
          <a href="#contact" className="text-realestate-navy hover:text-realestate-accent font-medium transition-colors">Contact</a>
          <Button className="bg-realestate-blue hover:bg-realestate-navy text-white flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Call Josh</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-realestate-navy" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <div className="container flex flex-col gap-4">
            <a href="#services" className="text-realestate-navy font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#properties" className="text-realestate-navy font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Properties</a>
            <a href="#about" className="text-realestate-navy font-medium py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="text-realestate-navy font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Button className="bg-realestate-blue hover:bg-realestate-navy text-white flex items-center justify-center gap-2 mt-2">
              <Phone className="h-4 w-4" />
              <span>Call Josh</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
