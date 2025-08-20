import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CompanionCharacter from "@/components/companion-character";
import { 
  Waves, 
  TreePine, 
  Cloud, 
  Music, 
  Play, 
  Pause,
  Volume2,
  Timer,
  Sparkles,
  Leaf,
  Mountain,
  Sun,
  Moon,
  Heart
} from "lucide-react";

const soundscapes = [
  {
    id: "rainforest",
    name: "Mystical Rainforest",
    description: "Gentle rain, chirping birds, and rustling leaves",
    icon: TreePine,
    color: "from-green-400 to-emerald-600",
    moodBoost: "Grounding and refreshing",
    duration: [5, 10, 15, 30, 60]
  },
  {
    id: "ocean",
    name: "Peaceful Ocean Waves", 
    description: "Rhythmic waves washing ashore",
    icon: Waves,
    color: "from-blue-400 to-cyan-600",
    moodBoost: "Calming and flowing",
    duration: [5, 10, 15, 30, 60]
  },
  {
    id: "lofi",
    name: "Lo-Fi Focus Beats",
    description: "Soft instrumental music for concentration",
    icon: Music,
    color: "from-purple-400 to-pink-600", 
    moodBoost: "Focused and creative",
    duration: [15, 30, 45, 60, 90]
  },
  {
    id: "mountain",
    name: "Mountain Breeze",
    description: "Wind through peaks with distant chimes",
    icon: Mountain,
    color: "from-gray-400 to-blue-500",
    moodBoost: "Expansive and clear",
    duration: [10, 20, 30, 45]
  },
  {
    id: "meadow",
    name: "Sunny Meadow",
    description: "Gentle breeze with buzzing bees and birds",
    icon: Sun,
    color: "from-yellow-400 to-green-500",
    moodBoost: "Uplifting and warm",
    duration: [5, 15, 25, 40]
  },
  {
    id: "night",
    name: "Starlit Night",
    description: "Crickets and gentle night sounds",
    icon: Moon,
    color: "from-indigo-500 to-purple-700",
    moodBoost: "Peaceful and restful",
    duration: [10, 20, 30, 60]
  }
];

const breathingPatterns = [
  {
    name: "Box Breathing",
    description: "4-4-4-4 pattern for balance and calm",
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    cycles: 6,
    benefits: "Reduces stress and improves focus"
  },
  {
    name: "Calming Breath",
    description: "4-7-8 pattern for deep relaxation",
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    cycles: 4,
    benefits: "Promotes sleep and reduces anxiety"
  },
  {
    name: "Energizing Breath",
    description: "3-0-3-0 pattern for gentle energy",
    inhale: 3,
    hold: 0,
    exhale: 3,
    pause: 0,
    cycles: 10,
    benefits: "Increases alertness and vitality"
  }
];

export default function RealmSerenity() {
  const [selectedSoundscape, setSelectedSoundscape] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [duration, setDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedBreathing, setSelectedBreathing] = useState<any>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("inhale");
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [breathingTimer, setBreathingTimer] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/soundscapes", { limit: 10 }],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest("/api/soundscapes", "POST", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/soundscapes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      toast({
        title: "Session completed!",
        description: "Your mindful moment has been recorded",
      });
    },
  });

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingActive && selectedBreathing) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTime = prev + 1;
          const { inhale, hold, exhale, pause } = selectedBreathing;
          const cycleLength = inhale + hold + exhale + pause;
          const position = newTime % cycleLength;
          
          if (position <= inhale) {
            setBreathingPhase("inhale");
          } else if (position <= inhale + hold) {
            setBreathingPhase("hold");
          } else if (position <= inhale + hold + exhale) {
            setBreathingPhase("exhale");
          } else {
            setBreathingPhase("pause");
          }
          
          if (position === 0 && newTime > 0) {
            setBreathingCycle(prev => prev + 1);
            if (breathingCycle >= selectedBreathing.cycles - 1) {
              setBreathingActive(false);
              setBreathingCycle(0);
              setBreathingTimer(0);
              toast({
                title: "Breathing exercise completed!",
                description: "You've completed a full breathing session",
              });
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [breathingActive, selectedBreathing, breathingCycle]);

  // Soundscape timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            completeSoundscapeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const startSoundscape = (soundscape: any) => {
    setSelectedSoundscape(soundscape);
    setTimeRemaining(duration * 60);
    setIsPlaying(true);
    toast({
      title: `${soundscape.name} started`,
      description: `Enjoy ${duration} minutes of serenity`,
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const completeSoundscapeSession = () => {
    if (selectedSoundscape) {
      createSessionMutation.mutate({
        soundscape: selectedSoundscape.id,
        duration: duration,
        mood: 4, // Assume positive mood after session
        completedActivity: "listening",
        effectiveness: 5
      });
    }
  };

  const startBreathingExercise = (pattern: any) => {
    setSelectedBreathing(pattern);
    setBreathingActive(true);
    setBreathingCycle(0);
    setBreathingTimer(0);
    setBreathingPhase("inhale");
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathingCycle(0);
    setBreathingTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 dark:from-blue-950 dark:via-cyan-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Realm Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Realm of Serenity
            </h1>
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A peaceful sanctuary for mindful breathing, ambient soundscapes, and AI-guided relaxation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="soundscapes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="soundscapes" className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Soundscapes
                </TabsTrigger>
                <TabsTrigger value="breathing" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Breathing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="soundscapes" className="space-y-6">
                {/* Active Soundscape Player */}
                {selectedSoundscape && isPlaying && (
                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <selectedSoundscape.icon className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{selectedSoundscape.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedSoundscape.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {formatTime(timeRemaining)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <Button onClick={togglePlayPause} size="sm">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        
                        <div className="flex items-center gap-2 flex-1">
                          <Volume2 className="w-4 h-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                        </div>
                      </div>

                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${((duration * 60 - timeRemaining) / (duration * 60)) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Soundscape Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  {soundscapes.map((soundscape) => {
                    const IconComponent = soundscape.icon;
                    return (
                      <Card key={soundscape.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className={`bg-gradient-to-r ${soundscape.color} text-white`}>
                          <CardTitle className="flex items-center gap-3">
                            <IconComponent className="w-6 h-6" />
                            {soundscape.name}
                          </CardTitle>
                          <p className="text-white/90 text-sm">{soundscape.description}</p>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              <Sparkles className="w-4 h-4 inline mr-1" />
                              {soundscape.moodBoost}
                            </p>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Duration (minutes):</label>
                              <div className="flex gap-2 flex-wrap">
                                {soundscape.duration.map((mins: number) => (
                                  <Button
                                    key={mins}
                                    size="sm"
                                    variant={duration === mins ? "default" : "outline"}
                                    onClick={() => setDuration(mins)}
                                  >
                                    {mins}m
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full"
                              onClick={() => startSoundscape(soundscape)}
                              disabled={isPlaying && selectedSoundscape?.id === soundscape.id}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Session
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="breathing" className="space-y-6">
                {/* Active Breathing Exercise */}
                {breathingActive && selectedBreathing && (
                  <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-8 text-center">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">{selectedBreathing.name}</h3>
                        
                        <div className="relative">
                          <div className={`
                            w-32 h-32 mx-auto rounded-full border-4 border-green-600 flex items-center justify-center
                            ${breathingPhase === 'inhale' ? 'animate-ping bg-green-100' : 
                              breathingPhase === 'hold' ? 'bg-green-200' :
                              breathingPhase === 'exhale' ? 'animate-pulse bg-green-50' : 'bg-gray-50'}
                            transition-all duration-1000
                          `}>
                            <span className="text-3xl font-bold text-green-800 capitalize">
                              {breathingPhase}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-lg">
                            Cycle {breathingCycle + 1} of {selectedBreathing.cycles}
                          </p>
                          <p className="text-muted-foreground">
                            {breathingPhase === 'inhale' && "Breathe in slowly..."}
                            {breathingPhase === 'hold' && "Hold your breath..."}
                            {breathingPhase === 'exhale' && "Breathe out gently..."}
                            {breathingPhase === 'pause' && "Rest naturally..."}
                          </p>
                        </div>
                        
                        <Button onClick={stopBreathingExercise} variant="outline">
                          Stop Exercise
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Breathing Pattern Selection */}
                {!breathingActive && (
                  <div className="grid gap-4">
                    {breathingPatterns.map((pattern, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{pattern.name}</h3>
                              <p className="text-muted-foreground mb-2">{pattern.description}</p>
                              <p className="text-sm text-green-600">{pattern.benefits}</p>
                            </div>
                            <Badge variant="outline">
                              {pattern.cycles} cycles
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <span>Inhale: {pattern.inhale}s</span>
                            {pattern.hold > 0 && <span>Hold: {pattern.hold}s</span>}
                            <span>Exhale: {pattern.exhale}s</span>
                            {pattern.pause > 0 && <span>Pause: {pattern.pause}s</span>}
                          </div>
                          
                          <Button 
                            onClick={() => startBreathingExercise(pattern)}
                            className="w-full"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Start {pattern.name}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Companion */}
            <CompanionCharacter size="large" />

            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Timer className="w-5 h-5" />
                  Serenity Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{Array.isArray(sessions) ? sessions.length : 0}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">
                      {Array.isArray(sessions) ? sessions.reduce((total: number, session: any) => total + (session.duration || 0), 0) : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mindfulness Level</span>
                    <span>Peaceful</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-[60%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Quick Calm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => startBreathingExercise(breathingPatterns[0])}>
                  <Heart className="w-4 h-4 mr-2" />
                  2-Minute Breathing
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => startSoundscape(soundscapes[1])}>
                  <Waves className="w-4 h-4 mr-2" />
                  5-Minute Ocean
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Cloud className="w-4 h-4 mr-2" />
                  Meditation Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}