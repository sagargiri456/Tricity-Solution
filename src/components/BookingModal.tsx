import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, MapPin, MessageSquare, Phone, Mail, User } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string;
  services?: Array<{
    title: string;
    icon: string;
    description: string;
    services: string[];
    image?: string;
  }>;
}

const BookingModal = ({ isOpen, onClose, selectedService, services = [] }: BookingModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service: selectedService || "",
    message: ""
  });

  const serviceOptions = services.length > 0 
    ? services.map(service => service.title)
    : [
        "Plumbing Services",
        "Painting Services", 
        "Waterproofing",
        "Carpentry Work",
        "Architectural Consultancy"
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.service) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL;
      // Always request sync mode during development to surface detailed results immediately
      const enableSync = Boolean((import.meta as any).env?.DEV ?? true);
      const baseUrl = apiBase ? `${apiBase}/api/bookings` : `/api/bookings`;
      const url = enableSync ? `${baseUrl}?sync=1` : baseUrl;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          service: formData.service,
          message: formData.message
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit booking");
      }

      const data = await res.json();
      const details = [] as string[];
      if (data?.notification?.whatsapp) details.push(`WhatsApp: ${data.notification.whatsapp}`);
      if (data?.notification?.email) details.push(`Email: ${data.notification.email}`);
      if (data?.results?.email) {
        const emailInfo = String(data.results.email);
        if (emailInfo.startsWith('http')) {
          details.push(`Email preview: ${emailInfo}`);
        } else {
          details.push(`Email id: ${emailInfo}`);
        }
      }
      if (data?.results?.errors?.whatsapp) details.push(`WA err: ${data.results.errors.whatsapp}`);
      if (data?.results?.errors?.email) details.push(`Email err: ${data.results.errors.email}`);
      toast({
        title: "Booking Submitted!",
        description: `Booking ID: ${data.bookingId}. ${details.join(" | ")}`,
      });

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        service: "",
        message: ""
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto bg-gradient-to-br from-background to-background/95 backdrop-blur-sm border-primary/10 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center">
            Book Our Services
          </DialogTitle>
          <div className="h-1 w-24 mx-auto mt-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </DialogHeader>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          onSubmit={handleSubmit} 
          className="space-y-5 mt-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-foreground/80">
                <User size={16} className="text-primary" /> Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
                required
                className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-foreground/80">
                <Phone size={16} className="text-primary" /> Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-foreground/80">
              <Mail size={16} className="text-primary" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
              className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2">
            <Label htmlFor="service" className="flex items-center gap-2 text-foreground/80">
              <Check size={16} className="text-primary" /> Type of Service *
            </Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-foreground/80">
              <MapPin size={16} className="text-primary" /> Service Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter the address where service is needed"
              rows={2}
              className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2 text-foreground/80">
              <MessageSquare size={16} className="text-primary" /> Additional Details
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us more about your requirements..."
              rows={3}
              className="border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              Submit Booking
            </Button>
          </motion.div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;