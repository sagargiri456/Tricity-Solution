import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  icon: string;
  description: string;
  services: string[];
  onBookNow: () => void;
  imageUrl?: string; // Optional image URL for service illustration
  image?: string; // Alternative prop name for image URL
}

const ServiceCard = ({ title, icon, description, services, onBookNow, imageUrl, image }: ServiceCardProps) => {
  // Use either imageUrl or image prop
  const displayImage = imageUrl || image;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5, rotateX: 2, rotateY: 2 }}
      className="shadow-premium hover:shadow-3d-effect group/card relative z-10 p-0.5 rounded-xl transition-all duration-500 perspective-1200"
    >
      {/* Enhanced border gradient with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl opacity-0 group-hover/card:opacity-100 transition-all duration-700 -z-10 transform group-hover/card:scale-[1.02]"></div>
      
      {/* Enhanced glowing border with depth */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform group-hover/card:scale-[1.03]" style={{ boxShadow: 'var(--card-glow-intense)' }}></div>
      <Card className="group h-full transition-all duration-500 border-0 relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-inner-glow transform group-hover/card:[transform-style:preserve-3d]">
        {/* Enhanced decorative gradient background with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-z-[-20px]"></div>
        
        {/* Enhanced 3D vertical shimmer effect with improved animations */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-40 pointer-events-none overflow-hidden transition-opacity duration-700">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-shimmer-vertical transform group-hover:translate-z-[-10px]"></div>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:400%_100%] animate-shimmer transform group-hover:translate-z-[-5px]"></div>
        </div>
        
        {/* Enhanced 3D floating particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute w-${1 + (i % 4)} h-${1 + (i % 4)} rounded-full bg-gradient-to-r ${i % 2 === 0 ? 'from-primary/40 to-secondary/40' : 'from-secondary/40 to-primary/40'} blur-sm`}
              initial={{ 
                x: `${5 + (i * 12)}%`, 
                y: `${5 + (i * 12)}%`,
                z: `${-20 + (i * 5)}`,
                opacity: 0.3 + (i * 0.08)
              }}
              animate={{ 
                x: `${5 + (i * 12)}%`, 
                y: `${5 + (i * 12)}%`,
                z: [0, 30, 0, -30, 0],
                scale: [1, 1.2, 1, 0.8, 1],
                opacity: [0.3 + (i * 0.08), 0.7 + (i * 0.05), 0.5 + (i * 0.07), 0.7 + (i * 0.05), 0.3 + (i * 0.08)]
              }}
              transition={{ 
                duration: 6 + (i * 0.5), 
                repeat: Infinity, 
                repeatType: "loop", 
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                boxShadow: `0 0 ${5 + (i * 2)}px rgba(var(--${i % 2 === 0 ? 'primary' : 'secondary'}-rgb), 0.${3 + (i % 5)})`,
              }}
            />
          ))}
        </div>
        
        {/* Static decorative accents */}
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-sm"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-sm"></div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rotate-45 transform origin-bottom-left opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        
        {/* Enhanced decorative floating particles with improved animations */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-primary/50 animate-float blur-[1px] transform group-hover:translate-z-[10px]"></div>
          <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-secondary/50 animate-float [animation-delay:1s] blur-[1px] transform group-hover:translate-z-[15px]"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-primary/50 animate-float [animation-delay:2s] blur-[1px] transform group-hover:translate-z-[12px]"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-secondary/50 animate-float [animation-delay:0.5s] blur-[1px] transform group-hover:translate-z-[20px]"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-primary/50 animate-float [animation-delay:1.5s] blur-[1px] transform group-hover:translate-z-[18px]"></div>
        </div>
        
        <CardContent className="p-5 h-full flex flex-col relative z-10">
          {/* Display image first if available */}
          {displayImage && (
            <div className="mb-4 overflow-hidden rounded-xl relative group/image shadow-inner">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg z-10"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-lg z-10"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/50 rounded-bl-lg z-10"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg z-10"></div>
              
              {/* Hover overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover/image:opacity-100 transition-all duration-500 z-10 mix-blend-overlay"></div>
              
              {/* Image with enhanced hover effects */}
              <img 
                src={displayImage} 
                alt={`${title} service illustration`} 
                className="w-full h-52 sm:h-56 md:h-60 object-cover object-center transform group-hover/image:scale-110 transition-all duration-700 ease-in-out"
                loading="lazy"
              />
              
              {/* Bottom gradient overlay for text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover/image:opacity-100 transition-opacity duration-500"></div>
              
              {/* Service title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-medium text-sm tracking-wide opacity-0 group-hover/image:opacity-100 transform group-hover/image:translate-y-0 translate-y-2 transition-all duration-500 text-center">
                <span className="bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">{title}</span>
              </div>
            </div>
          )}
          
          {/* Service icon with animations */}
          <div className="flex items-center gap-2 mb-3">
            <motion.div 
              className="text-2xl p-2 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 inline-block animate-float hover:shadow-glow-secondary relative group/icon overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
            {/* Icon background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-spin-slow opacity-70"></div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative z-10">{icon}</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-sm opacity-0 group-hover/icon:opacity-100 animate-spin-slow transition-opacity duration-500"></span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10" 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </motion.div>
          
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors relative tracking-tight">
            {title}
            <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 mt-1 rounded-full shadow-sm"></div>
            <span className="absolute -inset-1 bg-primary/5 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
          </h3>
          </div>
          

          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-2 rounded-lg mb-3">
             <p className="text-muted-foreground leading-tight text-sm relative">
               {description}
               <span className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 rounded-md"></span>
             </p>
           </div>
          
          <div className="mb-3">
            <h4 className="font-semibold mb-2 text-xs text-foreground flex items-center">
              <span className="mr-2 h-5 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full shadow-glow-secondary"></span>
              <span className="relative font-medium">Services Include:
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent"></span>
              </span>
            </h4>
            
            <ul className="text-xs text-muted-foreground space-y-1 bg-gradient-to-r from-white/50 to-transparent dark:from-slate-800/50 dark:to-transparent p-1.5 rounded-lg">
              {services.map((service, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center group/item relative overflow-hidden rounded-md px-1.5 py-1 border-l-2 border-transparent hover:border-primary/30 transition-all duration-300"
                  initial={{ opacity: 0, x: -5, z: -5 * index }}
                  animate={{ opacity: 1, x: 0, z: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 3, z: 10 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></span>
                  <span className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mr-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform shadow-sm relative z-10"></span>
                  <span className="group-hover/item:text-primary transition-colors relative z-10 font-medium">{service}</span>
                </motion.li>
              ))}
            </ul>
          </div>
            
            <div className="mt-auto pt-2">
              <Button 
                onClick={onBookNow}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground relative overflow-hidden group/button py-3 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute inset-0 w-[200%] bg-[length:200%_100%] bg-gradient-to-r from-primary/20 via-white/20 to-primary/20 animate-shimmer pointer-events-none"></span>
                <span className="flex items-center justify-center gap-2 relative z-10 group-hover/button:translate-x-[-2px] transition-transform duration-300 font-medium">
                  Book Now
                 <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 opacity-0 group-hover/button:opacity-100 group-hover/button:translate-x-1 transition-all duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;