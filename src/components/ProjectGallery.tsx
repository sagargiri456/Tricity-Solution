import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectWaterproofing from "@/assets/project-waterproofing.jpg";
import projectPainting from "@/assets/project-painting.jpg";
import projectPlumbing from "@/assets/project-plumbing.jpg";
import projectCarpentry from "@/assets/project-carpentry.jpg";
import projectArchitecture from "@/assets/project-architecture.jpg";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
  year: string;
}

const ProjectGallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [animateCards, setAnimateCards] = useState(false);
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Modern Kitchen Renovation",
      category: "Carpentry",
      image: projectKitchen,
      description: "Complete kitchen makeover with custom cabinets and granite countertops",
      location: "Sector 17, Chandigarh",
      year: "2024"
    },
    {
      id: 2,
      title: "Bathroom Waterproofing",
      category: "Waterproofing", 
      image: projectWaterproofing,
      description: "Professional waterproofing solution for master bathroom renovation",
      location: "Sector 35, Chandigarh",
      year: "2024"
    },
    {
      id: 3,
      title: "Office Interior Painting",
      category: "Painting",
      image: projectPainting,
      description: "Premium interior painting with texture work for corporate office",
      location: "IT Park, Mohali",
      year: "2023"
    },
    {
      id: 4,
      title: "Residential Plumbing",
      category: "Plumbing",
      image: projectPlumbing,
      description: "Complete plumbing installation for new residential construction",
      location: "Sector 22, Chandigarh",
      year: "2024"
    },
    {
      id: 5,
      title: "Custom Furniture Design",
      category: "Carpentry",
      image: projectCarpentry,
      description: "Bespoke wooden furniture and built-in storage solutions",
      location: "Panchkula",
      year: "2023"
    },
    {
      id: 6,
      title: "Architectural Planning",
      category: "Architecture",
      image: projectArchitecture,
      description: "Complete architectural design and 3D visualization for villa project",
      location: "Zirakpur",
      year: "2024"
    }
  ];

  const categories = ["All", "Carpentry", "Waterproofing", "Painting", "Plumbing", "Architecture"];
  
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Trigger animation when component mounts or category changes
  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);
  
  return (
    <section id="projects" className="py-16 bg-accent relative overflow-hidden scroll-mt-24">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent opacity-60 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/10 to-transparent opacity-60 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 relative inline-block">
            Our Past Projects
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Take a look at some of the quality work we've completed for our satisfied clients across Chandigarh and surrounding areas
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={activeCategory === category ? "primary" : "secondary"}
                className={`cursor-pointer transition-all duration-300 px-4 py-2 ${activeCategory === category ? 'scale-105 shadow-sm' : 'hover:scale-105'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <Badge className="bg-primary text-primary-foreground">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{project.description}</p>
                  <div className="flex justify-between items-center text-xs opacity-75">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Interested in seeing more of our work?
          </p>
          <Badge 
            variant="outline" 
            className="cursor-pointer relative overflow-hidden group px-6 py-3"
          >
            <span className="relative z-10 group-hover:text-primary-foreground transition-colors duration-300">View All Projects →</span>
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;