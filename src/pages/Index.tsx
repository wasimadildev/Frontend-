import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  HeartHandshake, 
  Users, 
  Calendar, 
  MessageCircle, 
  MapPin, 
  Shield,
  Clock,
  Award
} from 'lucide-react';
import hospitalHero from '@/assets/hospital-hero.jpg';
import Logo from '@/assets/logo.jpeg'
import { useEffect } from 'react';
import { initializeDummyData } from '@/lib/storage';


const Index = () => {
  useEffect(() => {
    initializeDummyData();
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Access to qualified healthcare professionals across all specializations'
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments instantly with real-time availability tracking'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat Support',
      description: '24/7 intelligent chatbot assistance for medical queries and guidance'
    },
    {
      icon: MapPin,
      title: '3D Hospital Navigation',
      description: 'Interactive hospital mapping with turn-by-turn navigation'
    },
    {
      icon: Shield,
      title: 'Secure Records',
      description: 'Your medical data is protected with advanced security measures'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about appointments and medical updates'
    }
  ];

  const stats = [
    { number: '500+', label: 'Expert Doctors' },
    { number: '50,000+', label: 'Happy Patients' },
    { number: '15+', label: 'Specializations' },
    { number: '24/7', label: 'Emergency Care' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                <img src={Logo} alt="" className='w-20 h-8'/>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0">
          <img 
            src={hospitalHero} 
            alt="Shifa Hospital" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 fade-in">
              Your Health, Our <span className="text-secondary-light">Priority</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 slide-up">
              Experience world-class healthcare with our intelligent patient engagement system. 
              Connect with expert doctors, schedule appointments, and get 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 ">
                  Chat with AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Advanced Healthcare Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive patient engagement platform combines cutting-edge technology 
              with personalized care to deliver the best healthcare experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-medical hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of patients who trust Shifa Hospital for their healthcare needs.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Shifa Hospital</span>
            </div>
            <div className="text-muted-foreground">
              © 2024 Shifa Hospital. Your trusted healthcare partner.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;