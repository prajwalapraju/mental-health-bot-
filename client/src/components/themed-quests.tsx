import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Trophy, 
  Clock, 
  Heart,
  Target,
  Star,
  Wand2,
  Gift,
  Crown,
  CheckCircle2,
  Plus
} from "lucide-react";
import type { Quest } from "@shared/schema";

const questThemes = {
  selfCompassion: {
    name: "Self-Compassion",
    color: "from-pink-400 to-rose-500",
    icon: Heart,
    description: "Nurture kindness toward yourself"
  },
  creativity: {
    name: "Creative Expression", 
    color: "from-purple-400 to-indigo-500",
    icon: Wand2,
    description: "Unlock your creative potential"
  },
  connection: {
    name: "Connection & Community",
    color: "from-blue-400 to-cyan-500", 
    icon: Star,
    description: "Build meaningful relationships"
  },
  mindfulness: {
    name: "Mindful Awareness",
    color: "from-green-400 to-emerald-500",
    icon: Target,
    description: "Cultivate present moment awareness"
  },
  growth: {
    name: "Personal Growth",
    color: "from-yellow-400 to-orange-500",
    icon: Crown,
    description: "Expand your emotional wisdom"
  }
};

const predefinedQuests = [
  {
    title: "Design Your Safe Space",
    description: "Create a detailed mental or physical sanctuary where you feel completely at peace",
    theme: "selfCompassion",
    experienceReward: 30,
    estimatedTime: "20-30 minutes",
    prompts: [
      "What colors make you feel most calm?",
      "What sounds would you include in your safe space?", 
      "Who or what would you want with you in this space?",
      "What activities would you do here?"
    ]
  },
  {
    title: "Write to Your Future Self",
    description: "Compose an encouraging letter to yourself one year from now",
    theme: "growth",
    experienceReward: 25,
    estimatedTime: "15-25 minutes",
    prompts: [
      "What challenges are you facing right now?",
      "What strengths do you want to remind your future self about?",
      "What hopes do you have for the coming year?",
      "What advice would you give your future self?"
    ]
  },
  {
    title: "Create Your Empathy Superhero",
    description: "Invent a superhero character whose power is deep understanding and compassion",
    theme: "creativity", 
    experienceReward: 35,
    estimatedTime: "25-35 minutes",
    prompts: [
      "What is your superhero's name and origin story?",
      "What special powers do they have for helping others?",
      "What does their costume look like?",
      "What is their greatest mission or quest?"
    ]
  },
  {
    title: "Practice Loving-Kindness",
    description: "Send good wishes to yourself, loved ones, and even difficult people in your life",
    theme: "mindfulness",
    experienceReward: 20,
    estimatedTime: "10-15 minutes", 
    prompts: [
      "Start with yourself: 'May I be happy, may I be healthy...'",
      "Extend to someone you love easily",
      "Think of a neutral person in your life",
      "Finally, include someone you find challenging"
    ]
  },
  {
    title: "Express Gratitude Creatively",
    description: "Create art, music, poetry, or movement to express what you're grateful for",
    theme: "creativity",
    experienceReward: 30,
    estimatedTime: "20-40 minutes",
    prompts: [
      "What are three things you're deeply grateful for today?",
      "How can you express this gratitude through creative means?",
      "What colors, sounds, or movements represent your gratitude?",
      "How does creating this make you feel?"
    ]
  },
  {
    title: "Random Acts of Kindness Plan",
    description: "Design a week of small, meaningful acts of kindness for others",
    theme: "connection",
    experienceReward: 25,
    estimatedTime: "15-20 minutes",
    prompts: [
      "What kind acts could you do for family/friends?",
      "How could you help strangers or your community?",
      "What acts of kindness cost nothing but mean everything?",
      "How will you remember to follow through this week?"
    ]
  }
];

interface ThemedQuestsProps {
  showCompleted?: boolean;
  limit?: number;
}

export default function ThemedQuests({ showCompleted = false, limit }: ThemedQuestsProps) {
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [questData, setQuestData] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [customQuest, setCustomQuest] = useState({ title: "", description: "", theme: "selfCompassion" });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quests = [], isLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests", { completed: showCompleted }],
  });

  const createQuestMutation = useMutation({
    mutationFn: async (questData: any) => {
      return apiRequest("/api/quests", "POST", questData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      setIsCreating(false);
      setCustomQuest({ title: "", description: "", theme: "selfCompassion" });
      toast({
        title: "Quest created! ✨",
        description: "Your magical quest awaits completion",
      });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async ({ questId, data }: { questId: string; data: any }) => {
      return apiRequest(`/api/quests/${questId}/complete`, "POST", { questData: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      setSelectedQuest(null);
      setQuestData({});
      toast({
        title: "Quest completed! 🎉",
        description: "Your companion gained experience from your journey",
      });
    },
  });

  const startPredefinedQuest = (quest: any) => {
    createQuestMutation.mutate({
      title: quest.title,
      description: quest.description,
      theme: quest.theme,
      experienceReward: quest.experienceReward,
      questData: {
        prompts: quest.prompts,
        estimatedTime: quest.estimatedTime,
        responses: {}
      }
    });
  };

  const startCustomQuest = () => {
    if (!customQuest.title.trim()) return;
    
    createQuestMutation.mutate({
      title: customQuest.title,
      description: customQuest.description,
      theme: customQuest.theme,
      experienceReward: 20,
      questData: {
        isCustom: true,
        responses: {}
      }
    });
  };

  const handleCompleteQuest = () => {
    if (!selectedQuest) return;
    
    completeQuestMutation.mutate({
      questId: selectedQuest.id,
      data: questData
    });
  };

  // Filter and limit quests
  const filteredQuests = quests.filter(q => showCompleted ? q.completed : !q.completed);
  const displayQuests = limit ? filteredQuests.slice(0, limit) : filteredQuests;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quest Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          {showCompleted ? "Completed Quests" : "Active Quests"}
          <Sparkles className="w-6 h-6 text-purple-500" />
        </h2>
        <p className="text-muted-foreground">
          {showCompleted 
            ? "Celebrate your completed magical journeys"
            : "Embark on themed adventures for emotional growth"
          }
        </p>
      </div>

      {/* Active Quests */}
      {displayQuests.length > 0 && (
        <div className="grid gap-4">
          {displayQuests.map((quest) => {
            const theme = questThemes[quest.type as keyof typeof questThemes] || questThemes.selfCompassion;
            const ThemeIcon = theme.icon;
            
            return (
              <Card key={quest.id} className="overflow-hidden border-2 hover:border-purple-200 transition-colors">
                <CardHeader className={`bg-gradient-to-r ${theme.color} text-white relative`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ThemeIcon className="w-6 h-6" />
                      <div>
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                        <p className="text-white/90 text-sm">{quest.description}</p>
                      </div>
                    </div>
                    {quest.completed && (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {theme.name}
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {quest.reward ? (quest.reward as any).experience || 25 : 25} XP
                      </span>
                      {(quest.questData as any)?.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {(quest.questData as any).estimatedTime}
                        </span>
                      )}
                    </div>
                    {quest.completedAt && (
                      <span className="text-green-600 font-medium">
                        Completed {new Date(quest.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {!quest.completed && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedQuest(quest)}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Begin Quest
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <ThemeIcon className="w-5 h-5" />
                            {quest.title}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{quest.description}</p>
                          
                          {(quest.questData as any)?.prompts && (
                            <div className="space-y-4">
                              <h4 className="font-medium">Quest Prompts:</h4>
                              {(quest.questData as any).prompts.map((prompt: string, index: number) => (
                                <div key={index} className="space-y-2">
                                  <label className="text-sm font-medium">{prompt}</label>
                                  <Textarea
                                    placeholder="Share your thoughts..."
                                    value={questData[`prompt_${index}`] || ""}
                                    onChange={(e) => setQuestData(prev => ({
                                      ...prev,
                                      [`prompt_${index}`]: e.target.value
                                    }))}
                                    className="min-h-[100px]"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {(quest.questData as any)?.isCustom && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Quest Reflection:</label>
                              <Textarea
                                placeholder="Describe your quest journey and insights..."
                                value={questData.reflection || ""}
                                onChange={(e) => setQuestData(prev => ({
                                  ...prev,
                                  reflection: e.target.value
                                }))}
                                className="min-h-[150px]"
                              />
                            </div>
                          )}

                          <Button 
                            onClick={handleCompleteQuest}
                            className="w-full"
                            disabled={completeQuestMutation.isPending}
                          >
                            {completeQuestMutation.isPending ? (
                              "Completing Quest..."
                            ) : (
                              <>
                                <Gift className="w-4 h-4 mr-2" />
                                Complete Quest & Earn Rewards
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Active Quests */}
      {!showCompleted && displayQuests.length === 0 && (
        <Card className="text-center p-8 border-dashed">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No active quests</h3>
              <p>Start a magical journey of emotional growth</p>
            </div>
          </div>
        </Card>
      )}

      {/* Create Quest Section */}
      {!showCompleted && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Start a New Quest</h3>
          
          {/* Predefined Quests */}
          <div className="grid gap-3">
            <h4 className="text-sm font-medium text-muted-foreground">Guided Quests</h4>
            {predefinedQuests.slice(0, 3).map((quest, index) => {
              const theme = questThemes[quest.theme as keyof typeof questThemes];
              const ThemeIcon = theme.icon;
              
              return (
                <Card key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => startPredefinedQuest(quest)}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${theme.color} text-white`}>
                      <ThemeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{quest.title}</h5>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{theme.name}</Badge>
                        <span className="text-xs text-muted-foreground">{quest.estimatedTime}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Custom Quest */}
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-3">Create Custom Quest</h4>
            <div className="space-y-3">
              <Input
                placeholder="Quest title..."
                value={customQuest.title}
                onChange={(e) => setCustomQuest(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Quest description (optional)..."
                value={customQuest.description}
                onChange={(e) => setCustomQuest(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <select 
                  value={customQuest.theme}
                  onChange={(e) => setCustomQuest(prev => ({ ...prev, theme: e.target.value }))}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.entries(questThemes).map(([key, theme]) => (
                    <option key={key} value={key}>{theme.name}</option>
                  ))}
                </select>
                <Button 
                  onClick={startCustomQuest}
                  disabled={!customQuest.title.trim() || createQuestMutation.isPending}
                >
                  {createQuestMutation.isPending ? "Creating..." : "Create Quest"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}