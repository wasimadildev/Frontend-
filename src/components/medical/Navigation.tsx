import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  Settings, 
  LogOut,
  HeartHandshake
} from 'lucide-react';
import { patientStorage } from '@/lib/storage';

export const Navigation = () => {
  const location = useLocation();
  const currentPatient = patientStorage.getCurrent();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/doctors', icon: Users, label: 'Doctors' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/chat', icon: MessageCircle, label: 'Chat Support' },
  ];

  const handleSignOut = () => {
    patientStorage.setCurrent(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Shifa Hospital</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentPatient && (
              <>
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="hidden md:block">{item.label}</span>
                    </Button>
                  </Link>
                ))}
                
                <div className="flex items-center space-x-2 px-3 py-1 bg-accent rounded-lg">
                  <span className="text-sm font-medium">{currentPatient.name}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Sign Out</span>
                </Button>
              </>
            )}
            
            {!currentPatient && (
              <Link to="/auth">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};