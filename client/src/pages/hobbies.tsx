import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Clock, 
  TrendingUp, 
  Users, 
  Brain, 
  Shield, 
  Sparkles,
  Phone,
  MessageCircle,
  AlertTriangle
} from "lucide-react";
import type { Hobby } from "@shared/schema";

interface HobbySuggestion {
  name: string;
  category: string;
  description: string;
  moodBoost: number;
  difficulty: string;
  timeCommitment: string;
  therapeuticBenefit: string;
  crisisSupport?: boolean;
  stressLevel?: string;
  socialSupport?: boolean;
}

interface SuggestionsResponse {
  suggestions: HobbySuggestion[];
  averageMood: number;
  moodContext: string;
  recommendations: string[];
  emotionalPatterns: Record<string, number>;
  supportResources: Array<{
    name: string;
    contact: string;
    description: string;
  }>;
}

const categoryIcons = {
  "Crisis Support": Shield,
  "Creative Healing": Sparkles,
  "Restorative": Heart,
  "Mindful Creation": Brain,
  "Connection": Users,
  "Purpose": TrendingUp,
  "Healing Community": Users,
  "Body-Mind Healing": Heart,
  "Moving Mindfulness": Brain,
  "Expressive Movement": Sparkles,
  "Reflective Practice": Brain,
  "Mental Stimulation": Brain,
  "Focused Calm": Heart,
  "Sound Healing": Sparkles,
  "Narrative Therapy": Brain,
  "Visual Awareness": Sparkles
};

const difficultyColors = {
  "Easy": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "Hard": "bg-red-100 text-red-800"
};

const moodContextColors = {
  "crisis": "border-red-500 bg-red-50",
  "high-stress": "border-orange-500 bg-orange-50",
  "moderate": "border-yellow-500 bg-yellow-50",
  "good": "border-green-500 bg-green-50"
};

export default function Hobbies() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<HobbySuggestion | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hobbies } = useQuery<Hobby[]>({
    queryKey: ["/api/hobbies"],
  });

  const { data: suggestions, isLoading: loadingSuggestions } = useQuery<SuggestionsResponse>({
    queryKey: ["/api/hobbies/suggestions"],
  });

  const addHobbyMutation = useMutation({
    mutationFn: async (suggestion: HobbySuggestion) => {
      return apiRequest(`/api/hobbies`, "POST", {
        name: suggestion.name,
        category: suggestion.category,
        frequency: "Weekly", // Default frequency
        enjoymentLevel: suggestion.moodBoost,
        isActive: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hobbies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hobbies/suggestions"] });
      toast({
        title: "Hobby Added!",
        description: "This activity has been added to your wellness toolkit.",
      });
      setSelectedSuggestion(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add hobby. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getMoodContextMessage = (context: string, avgMood: number) => {
    switch (context) {
      case "crisis":
        return {
          title: "Immediate Support Needed",
          message: "We've detected you may be going through a difficult time. These activities provide immediate support.",
          color: "text-red-600"
        };
      case "high-stress":
        return {
          title: "Stress Relief Focus",
          message: "These activities are specifically chosen to help reduce stress and promote calm.",
          color: "text-orange-600"
        };
      case "moderate":
        return {
          title: "Building Momentum",
          message: "These activities can help lift your spirits and build positive momentum.",
          color: "text-yellow-600"
        };
      default:
        return {
          title: "Maintaining Wellness",
          message: "You're in a good space! These activities can enhance your wellbeing.",
          color: "text-green-600"
        };
    }
  };

  if (loadingSuggestions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const contextInfo = suggestions ? getMoodContextMessage(suggestions.moodContext, suggestions.averageMood) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with mood context */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellness Activities</h1>
        
        {contextInfo && (
          <Card className={`border-2 ${moodContextColors[suggestions?.moodContext as keyof typeof moodContextColors || 'good']}`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${contextInfo.color} mb-2`}>
                    {contextInfo.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{contextInfo.message}</p>
                  
                  {suggestions?.recommendations && suggestions.recommendations.length > 0 && (
                    <div className="space-y-2">
                      {suggestions.recommendations.map((rec, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Crisis Support Resources */}
                  {suggestions?.supportResources && suggestions.supportResources.length > 0 && (
                    <div className="mt-6 p-4 bg-red-100 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <h4 className="font-semibold text-red-800">Crisis Support Resources</h4>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {suggestions.supportResources.map((resource, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <h5 className="font-medium text-gray-900">{resource.name}</h5>
                            <p className="text-sm font-mono text-blue-600 flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-1" />
                              {resource.contact}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mood visualization */}
                <div className="text-center min-w-[120px]">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {suggestions?.averageMood?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Avg Mood</div>
                  <Progress value={(suggestions?.averageMood || 0) * 20} className="w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Hobbies */}
      {hobbies && hobbies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Wellness Toolkit</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hobbies.map((hobby) => (
              <Card key={hobby.id} className="border border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900">{hobby.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{hobby.category}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">
                    {hobby.frequency}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Suggestions */}
      {suggestions?.suggestions && suggestions.suggestions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Personalized Recommendations
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {suggestions.suggestions.map((suggestion, index) => {
              const IconComponent = categoryIcons[suggestion.category as keyof typeof categoryIcons] || Heart;
              const isSelected = selectedSuggestion?.name === suggestion.name;
              
              return (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  } ${suggestion.crisisSupport ? 'border-red-300 bg-red-50' : ''}`}
                  onClick={() => setSelectedSuggestion(isSelected ? null : suggestion)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-6 h-6 ${
                          suggestion.crisisSupport ? 'text-red-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                          <p className="text-sm text-gray-500">{suggestion.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={difficultyColors[suggestion.difficulty as keyof typeof difficultyColors]}>
                          {suggestion.difficulty}
                        </Badge>
                        {suggestion.crisisSupport && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Crisis Support
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4">{suggestion.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{suggestion.timeCommitment}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Heart 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < suggestion.moodBoost ? 'text-pink-500 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Therapeutic Benefit</p>
                        <p className="text-sm text-blue-700">{suggestion.therapeuticBenefit}</p>
                      </div>
                      
                      {isSelected && (
                        <div className="pt-3 border-t">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addHobbyMutation.mutate(suggestion);
                            }}
                            disabled={addHobbyMutation.isPending}
                            className="w-full"
                          >
                            {addHobbyMutation.isPending ? "Adding..." : "Add to My Toolkit"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Emotional Patterns Insight */}
      {suggestions?.emotionalPatterns && Object.keys(suggestions.emotionalPatterns).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>Your Emotional Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(suggestions.emotionalPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([emotion, count]) => (
                <div key={emotion} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium capitalize">{emotion}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Based on your recent journal entries. This helps us recommend more targeted activities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}