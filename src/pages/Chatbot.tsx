import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/medical/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Calendar,
  Users,
  Phone,
  AlertTriangle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { patientStorage, chatStorage, ChatMessage, doctorStorage } from '@/lib/storage';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentPatient, setCurrentPatient] = useState(patientStorage.getCurrent());

  useEffect(() => {
    if (!currentPatient) {
      navigate('/auth');
      return;
    }

    // Load chat history for current patient
    const history = chatStorage.getHistory(currentPatient.id);
    setMessages(history);

    // Add welcome message if no history
    if (history.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'bot',
        message: `Hello ${currentPatient.name}! I'm your AI medical assistant. I can help you with:

• Booking appointments with doctors
• Answering general health questions  
• Providing hospital information
• Emergency assistance guidance
• Medication reminders

How can I help you today?`,
        timestamp: new Date().toISOString(),
        patientId: currentPatient.id
      };
      
      setMessages([welcomeMessage]);
      chatStorage.addMessage(welcomeMessage);
    }
  }, [navigate, currentPatient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Emergency keywords
    if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return `🚨 For medical emergencies, please:

1. Call emergency services: 911 or 1122
2. Visit our emergency department immediately
3. Contact our 24/7 hotline: +92-21-1234567

If this is not life-threatening, I can help you find appropriate care. What symptoms are you experiencing?`;
    }
    
    // Appointment booking
    if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
      return `📅 I'd be happy to help you book an appointment! 

You can:
• Browse available doctors by specialty
• Check doctor availability and ratings
• Book instantly with confirmation

Would you like me to show you our doctor directory? What type of specialist are you looking for?`;
    }
    
    // Doctor information
    if (message.includes('doctor') || message.includes('specialist')) {
      const doctors = doctorStorage.getAll();
      const availableDoctors = doctors.filter(d => d.status === 'available');
      
      return `👨‍⚕️ We have ${doctors.length} expert doctors across various specializations:

${doctors.slice(0, 3).map(d => `• Dr. ${d.name} - ${d.specialization} (${d.rating}⭐)`).join('\n')}

${availableDoctors.length} doctors are currently available for appointments. Would you like to see the full directory or search for a specific specialty?`;
    }
    
    // Symptoms or health concerns
    if (message.includes('pain') || message.includes('fever') || message.includes('sick') || 
        message.includes('headache') || message.includes('cough')) {
      return `🩺 I understand you're experiencing symptoms. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis.

Based on your symptoms, you may want to consider:
• Booking a consultation with a general physician
• If severe: Visit our emergency department
• For follow-up: Schedule with your regular doctor

Would you like me to help you book an appointment with one of our doctors?`;
    }
    
    // Hospital information
    if (message.includes('hospital') || message.includes('location') || message.includes('address')) {
      return `🏥 Shifa Hospital Information:

📍 Location: Main Campus, Healthcare District
🕒 Operating Hours: 24/7 Emergency, 8 AM - 8 PM General
📞 Main Line: +92-21-1234567
🆘 Emergency: 911 or 1122

Departments:
• Emergency Medicine
• Cardiology  
• Orthopedics
• Dermatology
• Neurology
• And many more...

Do you need directions or information about a specific department?`;
    }
    
    // Medication queries
    if (message.includes('medication') || message.includes('medicine') || message.includes('prescription')) {
      return `💊 For medication-related queries:

⚠️ Important: Never stop or change medications without consulting your doctor.

I can help you:
• Find information about your prescribed medications
• Set up appointment reminders
• Connect you with your prescribing physician

For specific medication questions, please consult with your doctor or our pharmacy team. Would you like me to help you schedule a consultation?`;
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! I'm here to assist you with your healthcare needs. How can I help you today?

Popular options:
• Book an appointment
• Find a doctor
• Hospital information  
• Health questions`;
    }
    
    // Default response
    return `I'm here to help with your healthcare needs. I can assist you with:

🩺 Medical consultations and appointments
🏥 Hospital information and services  
👨‍⚕️ Finding the right specialist
🚨 Emergency guidance
💊 General health information

Please let me know what specific information you're looking for, or feel free to ask any health-related question!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentPatient) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      patientId: currentPatient.id
    };

    setMessages(prev => [...prev, userMessage]);
    chatStorage.addMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);
    setSidebarOpen(false); // Close sidebar on mobile after sending

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'bot',
        message: generateBotResponse(userMessage.message),
        timestamp: new Date().toISOString(),
        patientId: currentPatient.id
      };

      setMessages(prev => [...prev, botResponse]);
      chatStorage.addMessage(botResponse);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      text: "Book an appointment",
      icon: Calendar,
      action: () => {
        navigate('/doctors');
        setSidebarOpen(false);
      }
    },
    {
      text: "Find a doctor",
      icon: Users,
      action: () => {
        navigate('/doctors');
        setSidebarOpen(false);
      }
    },
    {
      text: "Emergency help",
      icon: AlertTriangle,
      action: () => {
        setInputMessage("I need emergency help");
        setSidebarOpen(false);
      }
    },
    {
      text: "Hospital information",
      icon: Phone,
      action: () => {
        setInputMessage("Tell me about the hospital");
        setSidebarOpen(false);
      }
    }
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const Sidebar = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card className="card-medical">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3"
              onClick={action.action}
            >
              <action.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{action.text}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="card-medical">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span>Health Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="p-2 sm:p-3 bg-accent/50 rounded-lg">
            <h4 className="font-medium mb-1">💧 Stay Hydrated</h4>
            <p className="text-muted-foreground">Drink at least 8 glasses of water daily</p>
          </div>
          
          <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
            <h4 className="font-medium mb-1">🚶‍♀️ Regular Exercise</h4>
            <p className="text-muted-foreground">30 minutes of activity daily</p>
          </div>
          
          <div className="p-2 sm:p-3 bg-warning/10 rounded-lg">
            <h4 className="font-medium mb-1">😴 Quality Sleep</h4>
            <p className="text-muted-foreground">7-9 hours of sleep each night</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-medical">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span>Emergency:</span>
            <span className="font-medium text-destructive">911</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Hospital:</span>
            <span className="font-medium">+92-21-1234567</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Ambulance:</span>
            <span className="font-medium">1122</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                AI Medical Assistant
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                24/7 healthcare support and guidance
              </p>
            </div>
            
            {/* Mobile sidebar toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <div 
                className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-background border-l shadow-lg overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Sidebar />
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="card-medical flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] lg:h-[600px]">
                <CardHeader className="border-b p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span>Medical Assistant</span>
                    <Badge className="bg-success/10 text-success text-xs">Online</Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-2 sm:ml-4'
                              : 'bg-accent text-accent-foreground mr-2 sm:mr-4'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              {message.type === 'user' ? (
                                <User className="h-3 w-3 sm:h-4 sm:w-4 mt-1" />
                              ) : (
                                <Bot className="h-3 w-3 sm:h-4 sm:w-4 mt-1 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                                {message.message}
                              </div>
                              <div className="text-xs opacity-70 mt-1">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-accent text-accent-foreground rounded-lg p-2 sm:p-3 mr-2 sm:mr-4">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input */}
                  <div className="border-t p-3 sm:p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 text-sm sm:text-base"
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim()}
                        size="sm"
                        className="px-3 sm:px-4"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 sm:p-4">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {quickActions.slice(0, 3).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-xs"
                onClick={action.action}
              >
                <action.icon className="h-3 w-3 mr-1" />
                <span className="hidden xs:inline">{action.text}</span>
                <span className="xs:hidden">
                  {action.text.split(' ')[0]}
                </span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 text-xs"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">More</span>
              <span className="xs:hidden">•••</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind mobile quick actions */}
      <div className="lg:hidden h-16 sm:h-20"></div>
    </div>
  );
};

export default Chatbot;