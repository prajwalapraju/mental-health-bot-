import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ExternalLink } from "lucide-react";

export default function EmergencySupport() {
  const handleCallCrisis = () => {
    window.open("tel:988", "_self");
  };

  const handleChatSupport = () => {
    window.open("https://suicidepreventionlifeline.org/chat/", "_blank");
  };

  const handleTextSupport = () => {
    window.open("sms:741741", "_self");
  };

  return (
    <Card className="animate-fade-in bg-coral-50 border-coral-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-display text-gray-800">
          Need Immediate Support?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleCallCrisis}
          className="w-full bg-coral-500 hover:bg-coral-600 text-white"
        >
          <Phone className="w-4 h-4 mr-2" />
          Crisis Hotline: 988
        </Button>
        
        <Button
          onClick={handleChatSupport}
          variant="outline"
          className="w-full border-coral-300 text-coral-600 hover:bg-coral-50"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat Support
        </Button>

        <Button
          onClick={handleTextSupport}
          variant="outline"
          className="w-full border-coral-300 text-coral-600 hover:bg-coral-50"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Text HOME to 741741
        </Button>

        <div className="pt-3 border-t border-coral-200">
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>988:</strong> National Suicide Prevention Lifeline</p>
            <p><strong>741741:</strong> Crisis Text Line</p>
            <p className="italic">Available 24/7, free and confidential</p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open("https://findtreatment.samhsa.gov/", "_blank")}
            className="w-full text-coral-600 hover:text-coral-700 text-sm"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Find Local Mental Health Services
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
