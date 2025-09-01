import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeartHandshake, Mail, Phone, User, Calendar, MapPin } from 'lucide-react';
import { patientStorage, Patient } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const PatientAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({
    email: '',
    phone: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    const patient = patientStorage.findByEmail(loginData.email);
    
    if (patient) {
      patientStorage.setCurrent(patient);
      toast({
        title: "Welcome back!",
        description: `Hello ${patient.name}, you're now signed in.`
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Account not found",
        description: "No account found with this email. Please register first.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerData.name || !registerData.email || !registerData.phone || 
        !registerData.dateOfBirth || !registerData.gender) {
      toast({
        title: "Missing information",  
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if email already exists
    const existingPatient = patientStorage.findByEmail(registerData.email);
    if (existingPatient) {
      toast({
        title: "Account exists",
        description: "An account with this email already exists. Please sign in.",
        variant: "destructive"
      });
      return;
    }

    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      dateOfBirth: registerData.dateOfBirth,
      gender: registerData.gender,
      address: registerData.address,
      emergencyContact: {
        name: registerData.emergencyContactName,
        phone: registerData.emergencyContactPhone,
        relation: registerData.emergencyContactRelation
      },
      medicalHistory: [],
      allergies: [],
      currentMedications: [],
      registrationDate: new Date().toISOString()
    };

    patientStorage.add(newPatient);
    patientStorage.setCurrent(newPatient);
    
    toast({
      title: "Welcome to Shifa Hospital!",
      description: "Your account has been created successfully."
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HeartHandshake className="h-10 w-10 text-white" />
            <span className="text-2xl font-bold text-white">Shifa Hospital</span>
          </div>
          <p className="text-white/90">Your health journey starts here</p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Patient Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+92-300-1234567"
                        className="pl-10"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground">
                  Demo: Use "john.doe@example.com" to sign in with the sample patient
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="+92-300-1234567"
                        className="pl-10"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-dob">Date of Birth *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-dob"
                          type="date"
                          className="pl-10"
                          value={registerData.dateOfBirth}
                          onChange={(e) => setRegisterData({...registerData, dateOfBirth: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select 
                        value={registerData.gender} 
                        onValueChange={(value: 'male' | 'female') => 
                          setRegisterData({...registerData, gender: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-address"
                        placeholder="Your address"
                        className="pl-10"
                        value={registerData.address}
                        onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Emergency Contact</Label>
                    <div className="space-y-2 mt-2">
                      <Input
                        placeholder="Emergency contact name"
                        value={registerData.emergencyContactName}
                        onChange={(e) => setRegisterData({...registerData, emergencyContactName: e.target.value})}
                      />
                      <Input
                        placeholder="Emergency contact phone"
                        value={registerData.emergencyContactPhone}
                        onChange={(e) => setRegisterData({...registerData, emergencyContactPhone: e.target.value})}
                      />
                      <Input
                        placeholder="Relationship (e.g., spouse, parent)"
                        value={registerData.emergencyContactRelation}
                        onChange={(e) => setRegisterData({...registerData, emergencyContactRelation: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAuth;