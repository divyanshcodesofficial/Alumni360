import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">Access Denied</h1>
          <p className="text-muted-foreground leading-relaxed">
            You don't have permission to access this page. Please ensure you are logged in with the correct role.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/")} 
          className="gradient-primary text-white border-0 hover-glow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;