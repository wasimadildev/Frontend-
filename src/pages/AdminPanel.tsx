import { useState, useEffect } from 'react';
import { Navigation } from '@/components/medical/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Activity,
  Settings,
  Database,
  UserPlus,
  Trash2,
  Edit,
  Download
} from 'lucide-react';
import { 
  patientStorage, 
  doctorStorage, 
  appointmentStorage, 
  chatStorage,
  Patient,
  Doctor,
  Appointment 
} from '@/lib/storage';

const AdminPanel = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPatients(patientStorage.getAll());
    setDoctors(doctorStorage.getAll());
    setAppointments(appointmentStorage.getAll());
    setTotalMessages(chatStorage.getHistory().length);
  };

  const handleExportData = () => {
    const data = {
      patients: patientStorage.getAll(),
      doctors: doctorStorage.getAll(),
      appointments: appointmentStorage.getAll(),
      chatHistory: chatStorage.getHistory(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifa-hospital-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      loadData();
      window.location.reload();
    }
  };

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length.toString(),
      icon: Users,
      description: 'Registered patients',
      color: 'text-primary'
    },
    {
      title: 'Active Doctors',
      value: doctors.length.toString(),
      icon: Activity,
      description: 'Available doctors',
      color: 'text-secondary'
    },
    {
      title: 'Appointments',
      value: appointments.length.toString(),
      icon: Calendar,
      description: 'Total appointments',
      color: 'text-warning'
    },
    {
      title: 'Chat Messages',
      value: totalMessages.toString(),
      icon: MessageSquare,
      description: 'Support messages',
      color: 'text-success'
    }
  ];

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success';
      case 'busy': return 'bg-warning/10 text-warning';
      case 'offline': return 'bg-muted/10 text-muted-foreground';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              System management and analytics
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="destructive" onClick={handleClearAllData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-medical">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`p-3 bg-primary/10 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Patient Management</h3>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </div>
            
            <Card className="card-medical">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium">Registration Date</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                          <td className="p-4">{patient.name}</td>
                          <td className="p-4">{patient.email}</td>
                          <td className="p-4">{patient.phone}</td>
                          <td className="p-4">
                            {new Date(patient.registrationDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Doctor Management</h3>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </div>
            
            <Card className="card-medical">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Specialization</th>
                        <th className="p-4 font-medium">Experience</th>
                        <th className="p-4 font-medium">Rating</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-b">
                          <td className="p-4">{doctor.name}</td>
                          <td className="p-4">{doctor.specialization}</td>
                          <td className="p-4">{doctor.experience} years</td>
                          <td className="p-4">{doctor.rating} ⭐</td>
                          <td className="p-4">
                            <Badge className={getDoctorStatusColor(doctor.status)}>
                              {doctor.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Appointment Management</h3>
            </div>
            
            <Card className="card-medical">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Patient</th>
                        <th className="p-4 font-medium">Doctor</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Time</th>
                        <th className="p-4 font-medium">Type</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => {
                        const patient = patients.find(p => p.id === appointment.patientId);
                        const doctor = doctors.find(d => d.id === appointment.doctorId);
                        
                        return (
                          <tr key={appointment.id} className="border-b">
                            <td className="p-4">{patient?.name || 'Unknown'}</td>
                            <td className="p-4">{doctor?.name || 'Unknown'}</td>
                            <td className="p-4">
                              {new Date(appointment.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">{appointment.time}</td>
                            <td className="p-4 capitalize">{appointment.type}</td>
                            <td className="p-4">
                              <Badge className={getAppointmentStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <h3 className="text-lg font-semibold">System Settings</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Database Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Storage Usage</Label>
                    <div className="text-sm text-muted-foreground">
                      Total records: {patients.length + doctors.length + appointments.length}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleExportData}>
                      Export Data
                    </Button>
                    <Button variant="destructive" onClick={handleClearAllData}>
                      Reset System
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital-name">Hospital Name</Label>
                    <Input id="hospital-name" defaultValue="Shifa Hospital" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-number">Contact Number</Label>
                    <Input id="contact-number" defaultValue="+92-21-1234567" />
                  </div>
                  
                  <Button>Save Configuration</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;