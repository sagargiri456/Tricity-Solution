
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCard from "@/components/ServiceCard";
import BookingModal from "@/components/BookingModal";
import TestimonialCard from "@/components/TestimonialCard";
import ProjectGallery from "@/components/ProjectGallery";
import heroImage from "@/assets/hero-services.jpg";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Menu, X } from "lucide-react";
// Import service images
import plumbingImage from "@/assets/service-plumbing.jpg";
import paintingImage from "@/assets/service-painting.webp";
import waterproofingImage from "@/assets/service-waterproofing.jpg";
import carpentryImage from "@/assets/service-carpentry.webp";
import architecturalImage from "@/assets/service-architectural.jpg";
 

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const services = [
    {
      title: "Plumbing Services",
      icon: "🔧",
      description: "Professional plumbing solutions for homes and businesses with 24/7 emergency support.",
      services: ["Pipe Installation & Repair", "Drain Cleaning", "Water Heater Services", "Emergency Repairs", "Bathroom Fitting"],
      image: plumbingImage
    },
    {
      title: "Painting Services", 
      icon: "🎨",
      description: "Transform your spaces with our expert interior and exterior painting services.",
      services: ["Interior Painting", "Exterior Painting", "Texture Work", "Wall Preparation", "Color Consultation"],
      image: paintingImage
    },
    {
      title: "Waterproofing",
      icon: "🛡️", 
      description: "Protect your property from water damage with our advanced waterproofing solutions.",
      services: ["Roof Waterproofing", "Bathroom Waterproofing", "Basement Sealing", "Terrace Treatment", "Wall Waterproofing"],
      image: waterproofingImage
    },
    {
      title: "Carpentry Work",
      icon: "🪚",
      description: "Custom woodwork and furniture solutions crafted by skilled carpenters.",
      services: ["Custom Furniture", "Kitchen Cabinets", "Wardrobe Design", "Door & Window Frames", "Interior Woodwork"],
      image: carpentryImage
    },
    {
      title: "Architectural Consultancy",
      icon: "📐",
      description: "Professional architectural design and consultation services for your dream projects.",
      services: ["Design Planning", "3D Visualization", "Structural Consultation", "Project Management", "Interior Design"],
      image: architecturalImage
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Sector 17, Chandigarh",
      rating: 5,
      comment: "Excellent plumbing work! They fixed our water heater issue quickly and professionally. Highly recommended for anyone in Chandigarh."
    },
    {
      name: "Priya Sharma",
      location: "Sector 35, Chandigarh", 
      rating: 5,
      comment: "The painting team did an amazing job on our home interior. Very clean work and completed on time. Great value for money."
    },
    {
      name: "Amit Singh",
      location: "Mohali",
      rating: 5,
      comment: "Professional waterproofing service for our terrace. No more water leakage issues. The team was knowledgeable and efficient."
    }
  ];

  const handleBookNow = (serviceName?: string) => {
    setSelectedService(serviceName || "");
    setTimeout(() => {
      setIsBookingOpen(true);
    }, 100);
  };
  const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};


  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsHeroInView(entry.isIntersecting);
      },
      { root: null, threshold: 0.5 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show navbar when scrolled 100vh (full viewport height)
      setShowNavbar(scrollPosition >= viewportHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-white/10 dark:bg-neutral-900/20 backdrop-blur-lg border-b border-white/20 dark:border-white/10 z-50 shadow-md transition-all duration-300 ${
        showNavbar 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}>
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between relative">
          {/* TRICITY Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Main triangular shape */}
                <path d="M50 10 L85 70 L15 70 Z" fill="url(#triangleGradient)" />
                {/* Cityscape buildings */}
                <rect x="35" y="50" width="6" height="15" fill="url(#buildingGradient1)" />
                <rect x="42" y="45" width="6" height="20" fill="url(#buildingGradient2)" />
                <rect x="49" y="40" width="6" height="25" fill="url(#buildingGradient3)" />
                <rect x="56" y="45" width="6" height="20" fill="url(#buildingGradient2)" />
                <rect x="63" y="50" width="6" height="15" fill="url(#buildingGradient1)" />
                {/* Water/base line */}
                <rect x="30" y="65" width="40" height="3" fill="url(#waterGradient)" />
                {/* Side motion lines */}
                <path d="M15 70 L5 60" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
                <path d="M15 70 L8 63" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" />
                <path d="M85 70 L95 60" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
                <path d="M85 70 L92 63" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="buildingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="buildingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="buildingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-foreground tracking-wide">TRICITY</span>
              <span className="text-xs text-muted-foreground tracking-widest hidden sm:block">-SOLUTIONS-</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 absolute left-1/2 -translate-x-1/2">
            {[
              { href: '#services', label: 'Services' },
              { href: '#projects', label: 'Projects' },
              { href: '#testimonials', label: 'Testimonials' },
              { href: '#contact', label: 'Contact' }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="relative px-4 py-2 text-foreground group overflow-hidden rounded-md"
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href.replace('#', '')); }}
              >
                <span className="relative z-10 text-foreground font-semibold transition-colors duration-200">{item.label}</span>
                <span className="absolute inset-0 h-full w-0 bg-primary group-hover:w-full transition-all duration-300 rounded-md opacity-0 group-hover:opacity-100"></span>
              </a>
            ))}
          </div>
          
          {/* Desktop Book Now Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => handleBookNow()} 
              className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              onClick={() => handleBookNow()} 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-xs px-3 py-1"
            >
              Book Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-white/20 dark:border-white/10">
            <div className="px-4 py-4 space-y-2">
              {[
                { href: '#services', label: 'Services' },
                { href: '#projects', label: 'Projects' },
                { href: '#testimonials', label: 'Testimonials' },
                { href: '#contact', label: 'Contact' }
              ].map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="block px-4 py-3 text-foreground font-medium rounded-md hover:bg-primary/10 transition-colors duration-200"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    scrollToSection(item.href.replace('#', '')); 
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Simplified but Attractive Design */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Clean Background with Subtle Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Professional home services"
              className="w-full h-full object-cover filter brightness-75"
            />
          </div>
          
          {/* Simple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/70 mix-blend-multiply"></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-dot-pattern-small bg-[length:20px_20px] opacity-5"></div>
        </div>
        
        {/* Content Container with Clean Design */}
        <div className="relative z-10 text-center mt-6 text-white px-4 max-w-4xl mx-auto">
          {/* Elegant Badge */}
          <div className="mb-6 md:mb-8 inline-block">
            <span className="inline-flex items-center px-3 md:px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium border border-white/20">
              <span className="text-secondary mr-1 md:mr-2">★</span>
              <span className="tracking-wider hidden sm:inline">TRUSTED BY 1000+ CUSTOMERS IN CHANDIGARH</span>
              <span className="tracking-wider sm:hidden">1000+ HAPPY CLIENTS</span>
              <span className="text-secondary ml-1 md:ml-2">★</span>
            </span>
          </div>
          
          {/* Clean Headline */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main triangular shape */}
                    <path d="M50 10 L85 70 L15 70 Z" fill="url(#heroTriangleGradient)" />
                    {/* Cityscape buildings */}
                    <rect x="35" y="50" width="6" height="15" fill="url(#heroBuildingGradient1)" />
                    <rect x="42" y="45" width="6" height="20" fill="url(#heroBuildingGradient2)" />
                    <rect x="49" y="40" width="6" height="25" fill="url(#heroBuildingGradient3)" />
                    <rect x="56" y="45" width="6" height="20" fill="url(#heroBuildingGradient2)" />
                    <rect x="63" y="50" width="6" height="15" fill="url(#heroBuildingGradient1)" />
                    {/* Water/base line */}
                    <rect x="30" y="65" width="40" height="3" fill="url(#heroWaterGradient)" />
                    {/* Side motion lines */}
                    <path d="M15 70 L5 60" stroke="url(#heroLineGradient)" strokeWidth="2" fill="none" />
                    <path d="M15 70 L8 63" stroke="url(#heroLineGradient)" strokeWidth="1.5" fill="none" />
                    <path d="M85 70 L95 60" stroke="url(#heroLineGradient)" strokeWidth="2" fill="none" />
                    <path d="M85 70 L92 63" stroke="url(#heroLineGradient)" strokeWidth="1.5" fill="none" />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="heroTriangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e0e7ff" />
                      </linearGradient>
                      <linearGradient id="heroBuildingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                      </linearGradient>
                      <linearGradient id="heroBuildingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#e0e7ff" />
                      </linearGradient>
                      <linearGradient id="heroBuildingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                      </linearGradient>
                      <linearGradient id="heroWaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e0e7ff" />
                      </linearGradient>
                      <linearGradient id="heroLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-wide">TRICITY</span>
                  <span className="text-xs sm:text-sm md:text-lg text-white/80 tracking-widest">-SOLUTIONS-</span>
                </div>
              </div>
            </h1>
          </div>
          
          {/* Simple Subtitle */}
          <div className="mb-4 md:mb-6">
            <p className="text-lg sm:text-xl md:text-2xl font-light opacity-90 tracking-wide">
              Professional Home & Commercial Services
            </p>
          </div>
          
          {/* Clean Description */}
          <div className="mb-8 md:mb-10">
            <p className="text-sm sm:text-base md:text-lg p-3 md:p-5 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10">
              <span className="relative z-10">We provide top-quality home and commercial services in Chandigarh with a focus on reliability, professionalism, and customer satisfaction. Our team of experts is ready to transform your space.</span>
            </p>
          </div>
          
          {/* Attractive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button 
              onClick={() => handleBookNow()} 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white font-medium px-6 md:px-8 py-4 md:py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-1 text-sm md:text-base"
            >
              Book Our Services
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/20 text-primary hover:bg-primary/10 hover:text-white font-medium px-6 md:px-8 py-4 md:py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 text-sm md:text-base"
              onClick={() => scrollToSection('services')}
            >
              Explore Services
            </Button>
          </div>
          
          {/* Simple Statistics */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">1000+</p>
              <p className="text-xs md:text-sm text-white/70">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
              <p className="text-xs md:text-sm text-white/70">Expert Team</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">10+</p>
              <p className="text-xs md:text-sm text-white/70">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
              <p className="text-xs md:text-sm text-white/70">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Professional Services
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive home and commercial services across Chandigarh with skilled professionals and quality materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                icon={service.icon}
                description={service.description}
                services={service.services}
                image={service.image}
                onBookNow={() => handleBookNow(service.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <ProjectGallery />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                comment={testimonial.comment}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 relative overflow-hidden bg-accent scroll-mt-24">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-secondary/5 to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-4 md:mt-6">
              Ready to get started? Contact us today for a free consultation and quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <Card className="shadow-card border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Phone className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Phone</h4>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Mail className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Email</h4>
                      <p className="text-muted-foreground">info@theclientcompany.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm group-hover:shadow-md transition-all duration-300">
                      <MapPin className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Location</h4>
                      <p className="text-muted-foreground">Serving all sectors of Chandigarh & Mohali</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Clock className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Working Hours</h4>
                      <p className="text-muted-foreground">Mon - Sat: 8:00 AM - 7:00 PM</p>
                      <p className="text-muted-foreground">Emergency: 24/7 Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder */}
            <Card className="shadow-card border-0 group hover:shadow-glow transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d27439.970429352095!2d76.80389657908287!3d30.718504314581295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSCF%2050%2C%20Sector%208%20Panchkula%2C%20134109%20with%20location%E2%80%A2%E2%81%A0%20%E2%81%A0IN%20serving%20-%20Serving%20all%20pincodes%20of%20Chandigarh%2C%20Panchkula%2C%20Mohali%C2%A0and%C2%A0ZIrakpur!5e0!3m2!1sen!2sin!4v1757580326371!5m2!1sen!2sin"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 md:py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50"></div>
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-radial from-secondary/5 to-transparent opacity-60 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Main triangular shape */}
                    <path d="M50 10 L85 70 L15 70 Z" fill="url(#footerTriangleGradient)" />
                    {/* Cityscape buildings */}
                    <rect x="35" y="50" width="6" height="15" fill="url(#footerBuildingGradient1)" />
                    <rect x="42" y="45" width="6" height="20" fill="url(#footerBuildingGradient2)" />
                    <rect x="49" y="40" width="6" height="25" fill="url(#footerBuildingGradient3)" />
                    <rect x="56" y="45" width="6" height="20" fill="url(#footerBuildingGradient2)" />
                    <rect x="63" y="50" width="6" height="15" fill="url(#footerBuildingGradient1)" />
                    {/* Water/base line */}
                    <rect x="30" y="65" width="40" height="3" fill="url(#footerWaterGradient)" />
                    {/* Side motion lines */}
                    <path d="M15 70 L5 60" stroke="url(#footerLineGradient)" strokeWidth="2" fill="none" />
                    <path d="M15 70 L8 63" stroke="url(#footerLineGradient)" strokeWidth="1.5" fill="none" />
                    <path d="M85 70 L95 60" stroke="url(#footerLineGradient)" strokeWidth="2" fill="none" />
                    <path d="M85 70 L92 63" stroke="url(#footerLineGradient)" strokeWidth="1.5" fill="none" />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="footerTriangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <linearGradient id="footerBuildingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="footerBuildingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="footerBuildingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="footerWaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="footerLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">TRICITY</span>
                  <span className="text-xs text-muted-foreground tracking-widest">-SOLUTIONS-</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Professional services for all your home and office needs in Chandigarh. Quality work, timely delivery, and customer satisfaction guaranteed.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: "Facebook", link:"https://www.facebook.com/share/1CjbsdZZsZ/" },
                  // { icon: Twitter, label: "Twitter" },
                  // { icon: Instagram, label: "Instagram" },
                  // { icon: Linkedin, label: "LinkedIn" }
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a 
                      key={index}
                      href={social.link} 
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-background/80 text-muted-foreground hover:text-primary hover:bg-background hover:shadow-sm transition-all duration-300 group"
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h3 className="font-bold text-base md:text-lg relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-8 md:w-12 h-0.5 bg-primary/50 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "#", label: "Home" },
                  { href: "#services", label: "Services" },
                  { href: "#projects", label: "Projects" },
                  { href: "#testimonials", label: "Testimonials" },
                  { href: "#contact", label: "Contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h3 className="font-bold text-base md:text-lg relative inline-block">
                Services
                <span className="absolute -bottom-1 left-0 w-8 md:w-12 h-0.5 bg-primary/50 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h3 className="font-bold text-base md:text-lg relative inline-block">
                Contact Info
                <span className="absolute -bottom-1 left-0 w-8 md:w-12 h-0.5 bg-primary/50 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: MapPin, content: "Sector 17, Chandigarh, India" },
                  { icon: Phone, content: "+91 98765 43210" },
                  { icon: Mail, content: "info@clientcompany.com" },
                  { icon: Clock, content: "Mon-Sat: 9AM - 6PM" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="flex items-center group">
                      <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors duration-300">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {item.content}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/30 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p className="text-xs md:text-sm text-center md:text-left">&copy; {new Date().getFullYear()} TRICITY Solutions. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
              <a href="#" className="text-xs md:text-sm hover:text-primary transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-xs md:text-sm hover:text-primary transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-xs md:text-sm hover:text-primary transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        selectedService={selectedService}
      />
    </div>
  );
};

export default Index;