import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/medical/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Languages,
  DollarSign,
  User
} from 'lucide-react';
import { doctorStorage, patientStorage, Doctor } from '@/lib/storage';

const DoctorDirectory = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  useEffect(() => {
    const currentPatient = patientStorage.getCurrent();
    if (!currentPatient) {
      navigate('/auth');
      return;
    }

    const allDoctors = doctorStorage.getAll();
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
  }, [navigate]);

  useEffect(() => {
    const specializationFilter = selectedSpecialization === 'all' ? '' : selectedSpecialization;
    const filtered = doctorStorage.search(searchQuery, specializationFilter);
    setFilteredDoctors(filtered);
  }, [searchQuery, selectedSpecialization]);

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Doctors</h1>
          <p className="text-muted-foreground">
            Browse our network of qualified healthcare professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialization..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="card-medical hover:shadow-elevated transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({doctor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(doctor.status)}>
                    {getStatusText(doctor.status)}
                  </Badge>
                  <span className="text-sm font-medium">{doctor.experience} years exp.</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Rs. {doctor.consultationFee}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.availability.days.length} days available</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doctor.bio}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link to={`/doctor/${doctor.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Link to={`/doctor/${doctor.id}`} className="flex-1">
                    <Button 
                      className="w-full" 
                      disabled={doctor.status !== 'available'}
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all doctors.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialization('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDirectory;