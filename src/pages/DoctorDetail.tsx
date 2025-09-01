import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/medical/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Star, 
  MapPin, 
  Clock, 
  Languages,
  DollarSign,
  User,
  Award,
  Phone,
  Mail,
  Calendar as CalendarIcon
} from 'lucide-react';
import { doctorStorage, patientStorage, appointmentStorage, Doctor } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  useEffect(() => {
    const currentPatient = patientStorage.getCurrent();
    if (!currentPatient) {
      navigate('/auth');
      return;
    }

    if (id) {
      const foundDoctor = doctorStorage.findById(id);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      } else {
        navigate('/doctors');
      }
    }
  }, [id, navigate]);

  const handleBookAppointment = () => {
    const currentPatient = patientStorage.getCurrent();
    if (!currentPatient || !doctor || !selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time slot",
        variant: "destructive"
      });
      return;
    }

    const appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentPatient.id,
      doctorId: doctor.id,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTimeSlot,
      type: 'consultation' as const,
      status: 'scheduled' as const,
      symptoms: ''
    };

    appointmentStorage.add(appointment);
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}.`
    });

    navigate('/appointments');
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Doctor not found</h1>
            <Button onClick={() => navigate('/doctors')} className="mt-4">
              Back to Directory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Doctor['status']) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'busy': return 'status-busy';
      case 'offline': return 'status-offline';
      default: return 'status-offline';
    }
  };

  const getStatusText = (status: Doctor['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Header */}
        <Card className="card-medical mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-foreground">{doctor.name}</h1>
                  <Badge className={getStatusColor(doctor.status)}>
                    {getStatusText(doctor.status)}
                  </Badge>
                </div>
                
                <p className="text-xl text-primary font-medium mb-4">{doctor.specialization}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span>Rs. {doctor.consultationFee} consultation fee</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Available {doctor.availability.days.length} days/week</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-lg">{doctor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Information */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>About Dr. {doctor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {doctor.bio}
                    </p>
                    <div className="mt-6 space-y-3">
                      <h4 className="font-medium">Specialization Details:</h4>
                      <p className="text-muted-foreground">
                        As a specialist in {doctor.specialization.toLowerCase()}, Dr. {doctor.name} brings {doctor.experience} years of expertise to provide comprehensive care for patients.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="qualifications" className="space-y-4">
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>Educational Background</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {doctor.qualifications.map((qualification, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="font-medium">{qualification}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="availability" className="space-y-4">
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>Schedule Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Available Days:</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availability.days.map((day) => (
                            <Badge key={day} variant="outline">{day}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Time Slots:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {doctor.availability.timeSlots.map((slot) => (
                            <Badge key={slot} variant="outline">{slot}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Appointment Booking */}
          <div className="space-y-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Book Appointment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Date:</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3">Available Time Slots:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availability.timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTimeSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeSlot(slot)}
                          disabled={doctor.status !== 'available'}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Consultation Fee:</span>
                    <span className="text-xl font-bold text-primary">Rs. {doctor.consultationFee}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBookAppointment}
                    disabled={doctor.status !== 'available' || !selectedDate || !selectedTimeSlot}
                  >
                    Book Appointment
                  </Button>
                  
                  {doctor.status !== 'available' && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Doctor is currently {doctor.status.toLowerCase()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reception: +92-21-1234567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">appointments@shifa.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;