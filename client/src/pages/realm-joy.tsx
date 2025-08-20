import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Star, 
  Trophy, 
  Sparkles, 
  Heart, 
  Sun,
  Gift,
  Zap,
  ArrowLeft,
  Music,
  PartyPopper
} from "lucide-react";
import { Link } from "wouter";
import type { MoodEntry } from "@shared/schema";

const joyActivities = [
  {
    id: "gratitude-burst",
    name: "Gratitude Burst",
    description: "List 5 things that made you smile today",
    icon: Heart,
    points: 10,
    color: "from-pink-400 to-rose-500"
  },
  {
    id: "victory-dance",
    name: "Victory Dance",
    description: "Celebrate a recent accomplishment with movement",
    icon: Music,
    points: 15,
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: "joy-journal",
    name: "Joy Journal",
    description: "Write about what brings you the most happiness",
    icon: Star,
    points: 20,
    color: "from-purple-400 to-pink-500"
  },
  {
    id: "spread-sunshine",
    name: "Spread Sunshine",
    description: "Send a positive message to someone you care about",
    icon: Sun,
    points: 25,
    color: "from-yellow-300 to-yellow-500"
  }
];

const achievements = [
  { name: "Joy Seeker", description: "Complete 5 joy activities", icon: Star, unlocked: false },
  { name: "Happiness Catalyst", description: "Share joy with others 3 times", icon: Gift, unlocked: false },
  { name: "Radiant Energy", description: "Maintain high mood for 7 days", icon: Sun, unlocked: true },
  { name: "Master of Bliss", description: "Complete all joy activities in one day", icon: Trophy, unlocked: false }
];

export default function JoyRealm() {
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentMoods } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood"],
  });

  const createMoodMutation = useMutation({
    mutationFn: async (moodData: { mood: number; notes?: string }) => {
      return apiRequest("/api/mood", "POST", moodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 3000);
    },
  });

  const handleActivityComplete = (activityId: string) => {
    setCompletedActivities(prev => [...prev, activityId]);
    setCurrentActivity(activityId);
    
    // Record high mood entry
    createMoodMutation.mutate({
      mood: 5,
      notes: `Completed joy activity: ${joyActivities.find(a => a.id === activityId)?.name}`
    });

    toast({
      title: "Joy Activity Completed! ✨",
      description: "You earned points and boosted your mood!",
    });

    // Trigger celebration animation
    setCelebrationMode(true);
    setTimeout(() => setCelebrationMode(false), 3000);
  };

  const totalPoints = completedActivities.reduce((sum, activityId) => {
    const activity = joyActivities.find(a => a.id === activityId);
    return sum + (activity?.points || 0);
  }, 0);

  const avgMood = recentMoods && recentMoods.length > 0
    ? recentMoods.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, recentMoods.length)
    : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Celebration overlay */}
      {celebrationMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse">
            <PartyPopper className="w-24 h-24 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white">Celebration Time! 🎉</h2>
            <p className="text-xl text-white/90">You're radiating joy!</p>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Realms
            </Button>
          </Link>
          
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Joy Realm
          </h1>
          <p className="text-xl text-white/90 mb-6">Amplify your happiness and celebrate life's beautiful moments</p>
          
          {/* Mood & Points Display */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{avgMood.toFixed(1)}</div>
              <div className="text-sm text-white/80">Mood Level</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{totalPoints}</div>
              <div className="text-sm text-white/80">Joy Points</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-2xl font-bold text-white">{completedActivities.length}</div>
              <div className="text-sm text-white/80">Activities</div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Joy Activities */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              Joy Activities
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {joyActivities.map((activity) => {
                const isCompleted = completedActivities.includes(activity.id);
                const IconComponent = activity.icon;
                
                return (
                  <Card 
                    key={activity.id} 
                    className={`border-2 transition-all duration-300 transform hover:scale-105 ${
                      isCompleted 
                        ? 'border-green-400 bg-green-50 shadow-lg' 
                        : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${activity.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`${isCompleted ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {activity.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className={`text-lg font-semibold mb-2 ${isCompleted ? 'text-green-800' : 'text-white'}`}>
                        {activity.name}
                      </h3>
                      <p className={`text-sm mb-4 ${isCompleted ? 'text-green-700' : 'text-white/80'}`}>
                        {activity.description}
                      </p>
                      
                      {isCompleted ? (
                        <div className="flex items-center text-green-600">
                          <Trophy className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Completed!</span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleActivityComplete(activity.id)}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          disabled={createMoodMutation.isPending}
                        >
                          {createMoodMutation.isPending && currentActivity === activity.id ? (
                            "Celebrating..."
                          ) : (
                            "Complete Activity"
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Joy Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                      <span>Daily Goal</span>
                      <span>{completedActivities.length}/4</span>
                    </div>
                    <Progress value={(completedActivities.length / 4) * 100} className="bg-white/20" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                      <span>Joy Level</span>
                      <span>{Math.min(100, totalPoints)}%</span>
                    </div>
                    <Progress value={Math.min(100, totalPoints)} className="bg-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          achievement.unlocked 
                            ? 'bg-yellow-400/20 border border-yellow-400/30' 
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          achievement.unlocked ? 'text-yellow-300' : 'text-white/50'
                        }`} />
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            achievement.unlocked ? 'text-yellow-100' : 'text-white/70'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-xs ${
                            achievement.unlocked ? 'text-yellow-200' : 'text-white/50'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tools */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Realm Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/mood">
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                      Track Mood
                    </Button>
                  </Link>
                  <Link href="/journal">
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                      Joy Journal
                    </Button>
                  </Link>
                  <Link href="/hobbies">
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                      Happy Activities
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}