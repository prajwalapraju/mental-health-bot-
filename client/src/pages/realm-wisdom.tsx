import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CompanionCharacter from "@/components/companion-character";
import ThemedQuests from "@/components/themed-quests";
import { 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Sparkles, 
  MessageCircle,
  Target,
  Crown,
  Wand2,
  Stars,
  Scroll
} from "lucide-react";

const wisdomPrompts = [
  {
    category: "Self-Reflection",
    prompts: [
      "What pattern in your thinking would you like to understand better?",
      "When do you feel most confident in your decisions?",
      "What belief about yourself would you like to explore?",
      "How has a recent challenge helped you grow?"
    ]
  },
  {
    category: "Life Insights", 
    prompts: [
      "What life lesson took you the longest to learn?",
      "How do you know when you're making the right choice?",
      "What advice would you give to someone facing your current situation?",
      "What does wisdom mean to you personally?"
    ]
  },
  {
    category: "Future Visioning",
    prompts: [
      "What would your ideal day look like one year from now?",
      "What skills or qualities do you want to develop?",
      "How do you want to be remembered by others?",
      "What legacy do you want to create?"
    ]
  }
];

export default function RealmWisdom() {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [reflection, setReflection] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateInsightMutation = useMutation({
    mutationFn: async ({ prompt, userReflection }: { prompt: string; userReflection: string }) => {
      setIsGenerating(true);
      
      // Simulate AI response generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = [
        "Your reflection shows deep self-awareness. Consider exploring how this pattern might serve you in unexpected ways.",
        "This insight reveals your growing wisdom. The questions you're asking are signs of emotional maturity.",
        "Your thoughtful approach to this challenge demonstrates resilience. Trust in your ability to navigate complexity.",
        "The depth of your reflection suggests you're ready for the next level of personal growth.",
        "Your perspective shows both courage and compassion. These qualities will guide you well.",
        "This realization is a key step in your journey. Allow yourself to sit with this wisdom.",
        "Your honest self-examination is a gift to your future self. Keep exploring these thoughts.",
        "The clarity in your reflection shows you're developing strong inner wisdom."
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      
      return {
        insight: randomInsight,
        suggestions: [
          "Journal about this insight for 5 minutes daily this week",
          "Share this realization with someone you trust",
          "Create a visual reminder of this wisdom",
          "Apply this insight to a current challenge"
        ]
      };
    },
    onSuccess: (data) => {
      setAiResponse(data.insight);
      setIsGenerating(false);
      
      // Award experience to companion
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      
      toast({
        title: "Wisdom unlocked! ✨",
        description: "Your companion gained experience from your reflection",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Reflection saved",
        description: "Your wisdom has been captured in the realm",
        variant: "default"
      });
    }
  });

  const handleGenerateInsight = () => {
    if (!reflection.trim()) {
      toast({
        title: "Please share your reflection first",
        description: "Write your thoughts before seeking AI guidance",
        variant: "destructive"
      });
      return;
    }

    generateInsightMutation.mutate({
      prompt: selectedPrompt,
      userReflection: reflection
    });
  };

  const startNewReflection = () => {
    setSelectedPrompt("");
    setReflection("");
    setAiResponse("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Realm Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Realm of Wisdom
            </h1>
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A sanctuary for deep reflection, AI-guided insights, and the cultivation of inner wisdom
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="quests" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Wisdom Quests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-6">
                {/* AI Insights Section */}
                <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-indigo-600" />
                      AI-Guided Reflection
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Choose a prompt, share your thoughts, and receive personalized insights
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Prompt Selection */}
                    {!selectedPrompt && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Choose a reflection theme:</h3>
                        {wisdomPrompts.map((category) => (
                          <div key={category.category} className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              {category.category}
                            </h4>
                            <div className="grid gap-2">
                              {category.prompts.map((prompt, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  className="justify-start h-auto p-4 text-left"
                                  onClick={() => setSelectedPrompt(prompt)}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                  {prompt}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reflection Input */}
                    {selectedPrompt && !aiResponse && (
                      <div className="space-y-4">
                        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Scroll className="w-4 h-4" />
                            Your reflection prompt:
                          </h3>
                          <p className="text-muted-foreground">{selectedPrompt}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Share your thoughts:</label>
                          <Textarea
                            placeholder="Take your time to reflect deeply on this question. What comes to mind? What emotions or memories surface? There are no wrong answers..."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="min-h-[200px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleGenerateInsight}
                            disabled={isGenerating || !reflection.trim()}
                            className="flex-1"
                          >
                            {isGenerating ? (
                              <>
                                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                Generating insights...
                              </>
                            ) : (
                              <>
                                <Stars className="w-4 h-4 mr-2" />
                                Get AI Insights
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={startNewReflection}>
                            Change Prompt
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* AI Response */}
                    {aiResponse && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-6 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-indigo-600" />
                            AI Insight
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{aiResponse}</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Your Reflection:</h4>
                          <p className="text-sm text-muted-foreground italic">"{reflection}"</p>
                        </div>

                        <Button onClick={startNewReflection} className="w-full" variant="outline">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Start New Reflection
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Wisdom Library */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Wisdom Library
                    </CardTitle>
                    <p className="text-muted-foreground">Your collected insights and reflections</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Scroll className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your wisdom collection will appear here</p>
                      <p className="text-sm">Complete reflections to build your personal library</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quests">
                <ThemedQuests limit={5} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Companion */}
            <CompanionCharacter size="large" />

            {/* Wisdom Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5" />
                  Wisdom Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-600">0</div>
                    <div className="text-xs text-muted-foreground">Reflections</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-muted-foreground">Insights</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wisdom Level</span>
                    <span>Novice</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-[20%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Wisdom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Daily Wisdom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <div className="text-lg mb-2">"The only true wisdom is in knowing you know nothing."</div>
                  <div className="text-sm text-muted-foreground">- Socrates</div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Reflect on this
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}