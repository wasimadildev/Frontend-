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
  Clock
} from 'lucide-react';
import { patientStorage, chatStorage, ChatMessage, doctorStorage } from '@/lib/storage';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      action: () => navigate('/doctors')
    },
    {
      text: "Find a doctor",
      icon: Users,
      action: () => navigate('/doctors')
    },
    {
      text: "Emergency help",
      icon: AlertTriangle,
      action: () => setInputMessage("I need emergency help")
    },
    {
      text: "Hospital information",
      icon: Phone,
      action: () => setInputMessage("Tell me about the hospital")
    }
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Medical Assistant</h1>
          <p className="text-muted-foreground">24/7 healthcare support and guidance</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="card-medical h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Medical Assistant</span>
                  <Badge className="bg-success/10 text-success">Online</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-4'
                            : 'bg-accent text-accent-foreground mr-4'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0">
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 mt-1" />
                            ) : (
                              <Bot className="h-4 w-4 mt-1 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
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
                      <div className="bg-accent text-accent-foreground rounded-lg p-3 mr-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={action.action}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.text}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Health Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium mb-1">💧 Stay Hydrated</h4>
                  <p className="text-muted-foreground">Drink at least 8 glasses of water daily</p>
                </div>
                
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <h4 className="font-medium mb-1">🚶‍♀️ Regular Exercise</h4>
                  <p className="text-muted-foreground">30 minutes of activity daily</p>
                </div>
                
                <div className="p-3 bg-warning/10 rounded-lg">
                  <h4 className="font-medium mb-1">😴 Quality Sleep</h4>
                  <p className="text-muted-foreground">7-9 hours of sleep each night</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Emergency Contacts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Emergency:</span>
                  <span className="font-medium text-destructive">911</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospital:</span>
                  <span className="font-medium">+92-21-1234567</span>
                </div>
                <div className="flex justify-between">
                  <span>Ambulance:</span>
                  <span className="font-medium">1122</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;