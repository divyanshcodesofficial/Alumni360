import { useState } from "react";
import { MessageCircle, X, Send, User, Building, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isQuickAction?: boolean;
  actions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
}

interface UserData {
  name?: string;
  email?: string;
  type?: 'Alumni' | 'Student' | 'Institution' | 'Corporate';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm Alumni360 – your Alumni Engagement Assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      isQuickAction: true,
      actions: [
        { label: "Platform Features", action: "features" },
        { label: "For Institutions", action: "institutions" },
        { label: "For Alumni", action: "alumni" },
        { label: "Contact Support", action: "contact" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState<UserData>({});
  const [collectingData, setCollectingData] = useState(false);
  const [dataStep, setDataStep] = useState<'name' | 'email' | 'type' | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const openAuthModal = (type: 'signup' | 'signin') => {
    // This would trigger the auth modal - for now just show message
    addBotMessage(`Great! Let me open the ${type === 'signup' ? 'Sign Up' : 'Sign In'} form for you.`);
    setIsOpen(false);
  };

  const addBotMessage = (text: string, actions?: QuickAction[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      isQuickAction: !!actions,
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'features':
        addBotMessage(
          "Here are our key platform features:",
          [
            { label: "SKILL Program", action: "skill" },
            { label: "IMPACT Hub", action: "impact" },
            { label: "Networking Tools", action: "networking" },
            { label: "View All Features", action: "view_features" }
          ]
        );
        break;
      case 'institutions':
        addBotMessage(
          "Alumni360 helps institutions build stronger alumni networks and increase engagement. Would you like to:",
          [
            { label: "Sign Up for Demo", action: "demo" },
            { label: "View Impact Stories", action: "impact_section" },
            { label: "See Business Benefits", action: "business" },
            { label: "Contact Sales", action: "contact" }
          ]
        );
        break;
      case 'alumni':
        addBotMessage(
          "Welcome! Alumni360 connects you with your alma mater and fellow graduates. You can:",
          [
            { label: "Join Network", action: "join" },
            { label: "Find Mentors", action: "mentors" },
            { label: "Explore Events", action: "events" },
            { label: "View Success Stories", action: "testimonials" }
          ]
        );
        break;
      case 'contact':
        addBotMessage(
          "I'd be happy to help you get in touch with our team!",
          [
            { label: "Fill Contact Form", action: "contact_form" },
            { label: "Share Your Details", action: "collect_data" },
            { label: "Back to Main Menu", action: "main_menu" }
          ]
        );
        break;
      case 'skill':
        addBotMessage("Our SKILL Program connects alumni expertise with student learning through workshops, mentoring, and hands-on projects. Would you like to explore our impact stories or sign up?");
        break;
      case 'impact':
        addBotMessage("The IMPACT Hub enables alumni to give back through volunteering, social projects, and community initiatives. Check out our success stories!");
        break;
      case 'networking':
        addBotMessage("Our networking tools include LinkedIn integration, mentor matching, and community forums. Ready to join our network?");
        break;
      case 'demo':
        openAuthModal('signup');
        break;
      case 'join':
        openAuthModal('signin');
        break;
      case 'impact_section':
        scrollToSection('impact');
        break;
      case 'testimonials':
        scrollToSection('testimonials');
        break;
      case 'contact_form':
        scrollToSection('contact');
        break;
      case 'collect_data':
        startDataCollection();
        break;
      case 'main_menu':
        addBotMessage(
          "How can I help you today?",
          [
            { label: "Platform Features", action: "features" },
            { label: "For Institutions", action: "institutions" },
            { label: "For Alumni", action: "alumni" },
            { label: "Contact Support", action: "contact" }
          ]
        );
        break;
      default:
        addBotMessage("I'd be happy to help you with that! Could you provide more details?");
    }
  };

  const startDataCollection = () => {
    setCollectingData(true);
    setDataStep('name');
    addBotMessage("Great! Let me collect some basic information to better assist you. What's your name?");
  };

  const handleDataCollection = (input: string) => {
    switch (dataStep) {
      case 'name':
        setUserData(prev => ({ ...prev, name: input }));
        setDataStep('email');
        addBotMessage(`Nice to meet you, ${input}! What's your email address?`);
        break;
      case 'email':
        setUserData(prev => ({ ...prev, email: input }));
        setDataStep('type');
        addBotMessage(
          "Perfect! And which category best describes you?",
          [
            { label: "Alumni", action: "type_alumni" },
            { label: "Student", action: "type_student" },
            { label: "Institution", action: "type_institution" },
            { label: "Corporate", action: "type_corporate" }
          ]
        );
        break;
    }
  };

  const handleTypeSelection = (type: 'Alumni' | 'Student' | 'Institution' | 'Corporate') => {
    setUserData(prev => ({ ...prev, type }));
    setCollectingData(false);
    setDataStep(null);
    
    const personalizedMessage = type === 'Institution' 
      ? "Thank you! I'll connect you with our institutional solutions team. They'll reach out within 24 hours to discuss how Alumni360 can transform your alumni engagement."
      : `Thank you, ${userData.name}! I've saved your information. Our team will reach out soon with personalized recommendations for ${type.toLowerCase()} engagement opportunities.`;
    
    addBotMessage(personalizedMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (collectingData && dataStep && dataStep !== 'type') {
      addUserMessage(inputValue);
      handleDataCollection(inputValue);
      setInputValue("");
      return;
    }

    addUserMessage(inputValue);
    
    // Simple keyword-based responses
    const input = inputValue.toLowerCase();
    if (input.includes('price') || input.includes('cost')) {
      addBotMessage("Our pricing is flexible based on institution size and needs. Would you like to schedule a demo to discuss pricing options?", [
        { label: "Schedule Demo", action: "demo" },
        { label: "Contact Sales", action: "contact" }
      ]);
    } else if (input.includes('feature') || input.includes('what can')) {
      handleQuickAction('features');
    } else if (input.includes('help') || input.includes('support')) {
      addBotMessage("I'm here to help! What specific information are you looking for?", [
        { label: "Platform Features", action: "features" },
        { label: "Getting Started", action: "alumni" },
        { label: "Contact Team", action: "contact" }
      ]);
    } else {
      addBotMessage("That's a great question! For detailed information, I'd recommend connecting with our team who can provide personalized assistance.", [
        { label: "Contact Form", action: "contact_form" },
        { label: "Share Details", action: "collect_data" },
        { label: "Main Menu", action: "main_menu" }
      ]);
    }
    
    setInputValue("");
  };

  const handleSpecialAction = (action: string) => {
    if (action.startsWith('type_')) {
      const type = action.replace('type_', '') as 'alumni' | 'student' | 'institution' | 'corporate';
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1) as 'Alumni' | 'Student' | 'Institution' | 'Corporate';
      addUserMessage(capitalizedType);
      handleTypeSelection(capitalizedType);
    } else {
      handleQuickAction(action);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 flex flex-col shadow-2xl border-0 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span className="font-semibold">Alumni360 Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-light"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.actions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpecialAction(action.action)}
                        className="text-xs h-7 px-2 bg-background hover:bg-accent"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                collectingData && dataStep === 'name' ? "Enter your name..." :
                collectingData && dataStep === 'email' ? "Enter your email..." :
                "Type your message..."
              }
              className="flex-1 text-sm"
            />
            <Button type="submit" size="sm" className="px-3">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;