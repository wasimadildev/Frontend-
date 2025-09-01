import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/medical/Navigation';
import { 
  Calendar, 
  Users, 
  MessageCircle, 
  Clock,
  Activity,
  Heart,
  AlertCircle,
  Plus
} from 'lucide-react';
import { patientStorage, appointmentStorage, doctorStorage, Patient } from '@/lib/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    const currentPatient = patientStorage.getCurrent();
    if (!currentPatient) {
      navigate('/auth');
      return;
    }
    
    setPatient(currentPatient);
    
    // Get statistics
    const appointments = appointmentStorage.getByPatient(currentPatient.id);
    const upcomingCount = appointments.filter(apt => 
      apt.status === 'scheduled' && new Date(apt.date) >= new Date()
    ).length;
    setUpcomingAppointments(upcomingCount);
    
    const doctors = doctorStorage.getAll();
    setTotalDoctors(doctors.length);
  }, [navigate]);

  if (!patient) return null;

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule with available doctors',
      icon: Calendar,
      action: () => navigate('/doctors'),
      color: 'bg-primary'
    },
    {
      title: 'Chat Support',
      description: '24/7 AI medical assistance',
      icon: MessageCircle,
      action: () => navigate('/chat'),
      color: 'bg-secondary'
    },
    {
      title: 'Find Doctors',
      description: 'Browse specialist physicians',
      icon: Users,
      action: () => navigate('/doctors'),
      color: 'bg-warning'
    },
    {
      title: 'Emergency',
      description: 'Urgent medical assistance',
      icon: AlertCircle,
      action: () => navigate('/chat'),
      color: 'bg-destructive'
    }
  ];

  const healthStats = [
    {
      title: 'Total Appointments',
      value: upcomingAppointments.toString(),
      icon: Calendar,
      description: 'Scheduled visits'
    },
    {
      title: 'Available Doctors',
      value: totalDoctors.toString(),
      icon: Users,
      description: 'Expert physicians'
    },
    {
      title: 'Health Score',
      value: '85%',
      icon: Heart,
      description: 'Overall wellness'
    },
    {
      title: 'Last Visit',
      value: patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A',
      icon: Clock,
      description: 'Recent checkup'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {patient.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's your health dashboard overview
          </p>
        </div>

        {/* Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthStats.map((stat, index) => (
            <Card key={index} className="card-medical">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="card-medical hover:shadow-elevated transition-all duration-300 cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`p-4 ${action.color} rounded-lg inline-flex mb-4`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Medical Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Medical History */}
          <Card className="card-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Medical History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-accent/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{condition}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No medical history recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="card-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.currentMedications.length > 0 ? (
                patient.currentMedications.map((medication, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-secondary/10 rounded-lg">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">{medication}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No current medications</p>
              )}
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card className="card-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Allergies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-warning/10 rounded-lg">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm">{allergy}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No known allergies</p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="card-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Emergency Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.emergencyContact.name ? (
                <div className="space-y-2">
                  <p className="font-medium">{patient.emergencyContact.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.emergencyContact.phone}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {patient.emergencyContact.relation}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No emergency contact added</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;