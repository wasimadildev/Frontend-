import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/medical/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { patientStorage, appointmentStorage, doctorStorage, Appointment, Doctor } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AppointmentWithDoctor extends Appointment {
  doctor?: Doctor;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentPatient = patientStorage.getCurrent();
    if (!currentPatient) {
      navigate('/auth');
      return;
    }

    loadAppointments(currentPatient.id);
  }, [navigate]);

  const loadAppointments = (patientId: string) => {
    const patientAppointments = appointmentStorage.getByPatient(patientId);
    
    // Enhance appointments with doctor information
    const enhancedAppointments = patientAppointments.map(appointment => {
      const doctor = doctorStorage.findById(appointment.doctorId);
      return { ...appointment, doctor };
    });

    // Sort by date and time
    enhancedAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    setAppointments(enhancedAppointments);
    setLoading(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      const updatedAppt = { ...appointment, status: 'cancelled' as const };
      appointmentStorage.add(updatedAppt);
      
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${appointment.doctor?.name} has been cancelled.`
      });

      // Refresh appointments
      const currentPatient = patientStorage.getCurrent();
      if (currentPatient) {
        loadAppointments(currentPatient.id);
      }
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'follow-up': return 'bg-warning/10 text-warning border-warning/20';
      case 'emergency': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDateTime > new Date() && appointment.status === 'scheduled';
  };

  const upcomingAppointments = appointments.filter(isUpcoming);
  const pastAppointments = appointments.filter(apt => !isUpcoming(apt));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your scheduled and past appointments
            </p>
          </div>
          <Button onClick={() => navigate('/doctors')}>
            <Plus className="h-4 w-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="card-medical">
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule an appointment with one of our expert doctors
                  </p>
                  <Button onClick={() => navigate('/doctors')}>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="card-medical">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {appointment.doctor?.name || 'Doctor'}
                            </h3>
                            <p className="text-sm text-primary">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.doctor?.location || 'TBD'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                          <Badge className={getTypeColor(appointment.type)}>
                            {appointment.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/doctor/${appointment.doctorId}`)}
                        >
                          View Doctor
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card className="card-medical">
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No appointment history
                  </h3>
                  <p className="text-muted-foreground">
                    Your completed and cancelled appointments will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="card-medical opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {appointment.doctor?.name || 'Doctor'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.doctor?.location || 'TBD'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                          <Badge className={getTypeColor(appointment.type)}>
                            {appointment.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/doctor/${appointment.doctorId}`)}
                        >
                          View Doctor
                        </Button>
                        {appointment.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/doctors')}
                          >
                            Book Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;